import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { chatAboutEntry, GroqError, ChatMessage, AnalysisResult } from "@/lib/groq";
import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(["user","assistant"]), content: z.string() })),
  entryContent: z.string(),
  analysis: z.object({ moodScore:z.number(), moodLabel:z.string(), emotions:z.array(z.string()), themes:z.array(z.string()), insight:z.string(), keywords:z.array(z.string()) }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const { messages, entryContent, analysis } = parsed.data;
    const reply = await chatAboutEntry(messages.slice(-10) as ChatMessage[], entryContent, analysis as AnalysisResult);
    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof GroqError) {
      const s = { RATE_LIMIT:429, TIMEOUT:408, INVALID_RESPONSE:502, NETWORK:503, UNKNOWN:500 };
      return NextResponse.json({ error: error.message, code: error.code }, { status: s[error.code] });
    }
    console.error("[/api/chat]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
