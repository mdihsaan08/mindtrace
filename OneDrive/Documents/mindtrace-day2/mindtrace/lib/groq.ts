import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const cache = new Map<string, { result: AnalysisResult; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 10;

export interface AnalysisResult {
  moodScore: number;
  moodLabel: string;
  emotions: string[];
  themes: string[];
  insight: string;
  keywords: string[];
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export class GroqError extends Error {
  constructor(message: string, public code: "RATE_LIMIT"|"TIMEOUT"|"INVALID_RESPONSE"|"NETWORK"|"UNKNOWN") {
    super(message); this.name = "GroqError";
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: Error = new Error("Unknown");
  for (let attempt = 1; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("429")) throw new GroqError("Rate limit reached. Please wait 30 seconds.", "RATE_LIMIT");
      if (msg.includes("401") || msg.includes("unauthorized")) throw new GroqError("Invalid API key.", "UNKNOWN");
      if (attempt === retries) break;
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
  throw new GroqError(`Failed after ${retries} attempts: ${lastError.message}`, "NETWORK");
}

export async function analyzeJournalEntry(content: string, selectedMood?: string): Promise<AnalysisResult> {
  const cacheKey = `${content.slice(0, 100)}_${selectedMood ?? ""}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.result;

  const prompt = `You are a compassionate AI mental health journaling assistant. Analyze this journal entry and respond ONLY with valid JSON. No markdown, no explanation.

Journal entry: "${content}"
${selectedMood ? `User mood: "${selectedMood}"` : ""}

Return exactly:
{
  "moodScore": <integer 1-10>,
  "moodLabel": "<single word>",
  "emotions": ["<e1>","<e2>","<e3>"],
  "themes": ["<t1>","<t2>"],
  "insight": "<2-3 warm specific sentences>",
  "keywords": ["<k1>","<k2>","<k3>","<k4>"]
}`;

  const result = await withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", max_tokens: 512, temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.choices[0]?.message?.content ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    let parsed: AnalysisResult;
    try { parsed = JSON.parse(clean); }
    catch { throw new GroqError("AI returned invalid JSON.", "INVALID_RESPONSE"); }
    if (typeof parsed.moodScore !== "number" || parsed.moodScore < 1 || parsed.moodScore > 10)
      throw new GroqError("Invalid mood score.", "INVALID_RESPONSE");
    return parsed;
  });

  cache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

export async function chatAboutEntry(messages: ChatMessage[], entryContext: string, analysis: AnalysisResult): Promise<string> {
  const systemPrompt = `You are a compassionate AI mental health journaling companion.
--- Journal Entry ---
${entryContext}
--- Analysis ---
Mood: ${analysis.moodScore}/10 (${analysis.moodLabel})
Emotions: ${analysis.emotions.join(", ")}
Themes: ${analysis.themes.join(", ")}
Insight: ${analysis.insight}
---
Be warm, empathetic, specific. Keep responses to 2-4 sentences. Never diagnose or give medical advice.`;

  return await withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", max_tokens: 256, temperature: 0.8,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });
    const text = response.choices[0]?.message?.content ?? "";
    if (!text) throw new GroqError("Empty response.", "INVALID_RESPONSE");
    return text;
  });
}

export default groq;
