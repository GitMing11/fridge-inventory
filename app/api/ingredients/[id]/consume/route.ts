// app/api/ingredients/[id]/consume/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await request.json(); // 'eaten' or 'discarded'

  if (!['eaten', 'discarded'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const id = Number(params.id);
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!ingredient) {
    return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
  }

  // 기록 저장
  await prisma.ingredientHistory.create({
    data: {
      name: ingredient.name,
      categoryName: ingredient.category.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      expiration: ingredient.expiration,
      purchasedAt: ingredient.purchasedAt,
      consumedAt: new Date(),
      status,
    },
  });

  // 원래 재료는 삭제
  await prisma.ingredient.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
