import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 최신 버전 대응 (await params)
  const body = await request.json();
  const { name, categoryId, quantity, unit, expiration, purchasedAt } = body;

  try {
    const updated = await prisma.ingredient.update({
      where: { id: Number(id) },
      data: {
        name,
        categoryId: Number(categoryId),
        quantity: Number(quantity),
        unit,
        expiration: new Date(expiration),
        purchasedAt: new Date(purchasedAt),
      },
      include: { category: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '재료 수정 실패' },
      { status: 500 }
    );
  }
}