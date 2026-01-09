// app/api/ingredients/[id]/consume/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  request: Request,
  // [수정 1] params 타입을 Promise로 변경
  { params }: { params: Promise<{ id: string }> } 
) {
  // [수정 2] params를 await하여 id 추출
  const { id: idString } = await params; 
  const id = Number(idString);
  // quantity 추가
  const { status, quantity } = await request.json(); 

  if (!['eaten', 'discarded'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const consumeQuantity = Number(quantity); // 소비할 수량

  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!ingredient) {
    return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
  }

  // 유효성 검사: 소비량이 0보다 작거나 현재 수량보다 많을 수 없음
  if (consumeQuantity <= 0 || consumeQuantity > ingredient.quantity) {
     return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
  }

  // 남은 수량 계산
  const remainingQuantity = ingredient.quantity - consumeQuantity;

  // 1. 기록(History) 저장 (소비한 수량만큼만)
  await prisma.ingredientHistory.create({
    data: {
      name: ingredient.name,
      categoryName: ingredient.category.name,
      quantity: consumeQuantity, // 실제 소비한 양
      unit: ingredient.unit,
      expiration: ingredient.expiration,
      purchasedAt: ingredient.purchasedAt,
      consumedAt: new Date(),
      status,
    },
  });

  // 2. 재료 처리
  if (remainingQuantity > 0) {
    // 일부만 소비한 경우: 수량 업데이트
    await prisma.ingredient.update({
      where: { id },
      data: { quantity: remainingQuantity },
    });
  } else {
    // 전부 소비한 경우 (또는 그 이상): 재료 삭제
    await prisma.ingredient.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}