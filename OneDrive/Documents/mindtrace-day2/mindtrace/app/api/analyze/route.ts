import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeJournalEntry, GroqError } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(20).max(5000),
  selectedMood: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const { content, selectedMood } = parsed.data;
    const analysis = await analyzeJournalEntry(content, selectedMood);
    const entry = await prisma.journalEntry.create({
      data: { userId: session.user.id, content, selectedMood, moodScore: analysis.moodScore, moodLabel: analysis.moodLabel, emotions: analysis.emotions, themes: analysis.themes, insight: analysis.insight, keywords: analysis.keywords },
    });
    return NextResponse.json({ entry, analysis }, { status: 201 });
  } catch (error) {
    if (error instanceof GroqError) {
      const s = { RATE_LIMIT:429, TIMEOUT:408, INVALID_RESPONSE:502, NETWORK:503, UNKNOWN:500 };
      return NextResponse.json({ error: error.message, code: error.code }, { status: s[error.code] });
    }
    console.error("[/api/analyze]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
