import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().max(255).transform(v => v.toLowerCase().trim()),
  password: z.string().min(8).max(72).regex(/[A-Z]/,"Must contain uppercase").regex(/[0-9]/,"Must contain number"),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid format." }, { status: 400 }); }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name: name.trim(), email, password: hashed }, select: { id:true, name:true, email:true } });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
