import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch (e) {
    // ponytail: duplicate email counts as subscribed
    if (
      !(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
    ) {
      console.error("subscribe failed:", e);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
