import Groq from "groq-sdk";

// ─── Client ──────────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Simple In-Memory Cache ───────────────────────────────────────────────────
const cache = new Map<string, { result: AnalysisResult; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function getCacheKey(content: string, mood?: string) {
  return `${content.slice(0, 100)}_${mood ?? ""}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AnalysisResult {
  moodScore: number;
  moodLabel: string;
  emotions: string[];
  themes: string[];
  insight: string;
  keywords: string[];
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export class GroqError extends Error {
  constructor(
    message: string,
    public code: "RATE_LIMIT" | "TIMEOUT" | "INVALID_RESPONSE" | "NETWORK" | "UNKNOWN"
  ) {
    super(message);
    this.name = "GroqError";
  }
}

// ─── Retry Utility ────────────────────────────────────────────────────────────
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const message = lastError.message.toLowerCase();

      // Don't retry on rate limits — wait longer
      if (message.includes("rate limit") || message.includes("429")) {
        throw new GroqError(
          "You've hit the rate limit. Please wait 30 seconds and try again.",
          "RATE_LIMIT"
        );
      }

      // Don't retry on invalid API key
      if (message.includes("401") || message.includes("unauthorized")) {
        throw new GroqError("Invalid API key. Check your GROQ_API_KEY.", "UNKNOWN");
      }

      // Last attempt — throw
      if (attempt === retries) break;

      // Wait before retrying (exponential backoff)
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }

  throw new GroqError(
    `Failed after ${retries} attempts: ${lastError.message}`,
    "NETWORK"
  );
}

// ─── Analyze Journal Entry ────────────────────────────────────────────────────
export async function analyzeJournalEntry(
  content: string,
  selectedMood?: string
): Promise<AnalysisResult> {
  // Check cache first
  const cacheKey = getCacheKey(content, selectedMood);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const prompt = `You are a compassionate AI mental health journaling assistant. Analyze this journal entry and respond ONLY with valid JSON. No markdown, no explanation, no code fences.

Journal entry: "${content}"
${selectedMood ? `User mood tag: "${selectedMood}"` : ""}

Return exactly this JSON:
{
  "moodScore": <integer 1-10>,
  "moodLabel": "<single word>",
  "emotions": ["<e1>", "<e2>", "<e3>"],
  "themes": ["<t1>", "<t2>"],
  "insight": "<2-3 warm specific sentences>",
  "keywords": ["<k1>", "<k2>", "<k3>", "<k4>"]
}`;

  const result = await withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 512,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      });

      clearTimeout(timeout);
      const text = response.choices[0]?.message?.content ?? "";
      const clean = text.replace(/```json|```/g, "").trim();

      let parsed: AnalysisResult;
      try {
        parsed = JSON.parse(clean);
      } catch {
        throw new GroqError("AI returned invalid JSON. Retrying...", "INVALID_RESPONSE");
      }

      if (typeof parsed.moodScore !== "number" || parsed.moodScore < 1 || parsed.moodScore > 10) {
        throw new GroqError("Invalid mood score in response.", "INVALID_RESPONSE");
      }

      return parsed;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        throw new GroqError("Request timed out. Please try again.", "TIMEOUT");
      }
      throw err;
    }
  });

  // Save to cache
  cache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ─── Multi-Turn Chat ──────────────────────────────────────────────────────────
export async function chatAboutEntry(
  messages: ChatMessage[],
  entryContext: string,
  analysis: AnalysisResult
): Promise<string> {
  const systemPrompt = `You are a compassionate AI mental health journaling companion. The user has just written a journal entry and received an analysis. Your role is to have a warm, supportive conversation with them about their thoughts and feelings.

--- Their Journal Entry ---
${entryContext}

--- Analysis Summary ---
Mood Score: ${analysis.moodScore}/10 (${analysis.moodLabel})
Emotions detected: ${analysis.emotions.join(", ")}
Themes: ${analysis.themes.join(", ")}
Your insight: ${analysis.insight}
-------------------------

Guidelines:
- Be warm, empathetic, and non-judgmental
- Ask thoughtful follow-up questions to help them reflect deeper
- Reference specific things they wrote — don't be generic
- Keep responses concise (2-4 sentences max)
- Never diagnose or give medical advice
- If they seem in crisis, gently suggest professional support`;

  return await withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 256,
      temperature: 0.8,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const text = response.choices[0]?.message?.content ?? "";
    if (!text) throw new GroqError("Empty response from AI.", "INVALID_RESPONSE");
    return text;
  });
}

export default groq;