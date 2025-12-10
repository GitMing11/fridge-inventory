import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "카테고리 이름이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if ((error as any).code === "P2002") {
      // Prisma unique constraint violation
      return NextResponse.json(
        { error: "이미 존재하는 카테고리입니다." },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
