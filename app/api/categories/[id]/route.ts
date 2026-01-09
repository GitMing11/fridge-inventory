import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface Params {
  params: { id: string };
}

// 카테고리 수정 (이름 변경)
export async function PATCH(request: Request, { params }: Params) {
  const id = parseInt(params.id);
  const body = await request.json();
  const { name } = body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "카테고리 수정 실패" },
      { status: 500 }
    );
  }
}

// 카테고리 삭제
export async function DELETE(request: Request, { params }: Params) {
  const id = parseInt(params.id);

  try {
    // 1. 해당 카테고리를 사용 중인 재료가 있는지 확인
    const ingredientsCount = await prisma.ingredient.count({
      where: { categoryId: id },
    });

    if (ingredientsCount > 0) {
      return NextResponse.json(
        { error: "이 카테고리에 속한 재료가 있어 삭제할 수 없습니다. 재료를 먼저 삭제하거나 이동해주세요." },
        { status: 400 }
      );
    }

    // 2. 사용 중인 재료가 없으면 삭제 진행
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    return NextResponse.json(
      { error: "카테고리 삭제 실패" },
      { status: 500 }
    );
  }
}