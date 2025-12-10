// app/api/history/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const history = await prisma.ingredientHistory.findMany({
      orderBy: { consumedAt: "desc" },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
