import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({
    include: { category: true },
    orderBy: { expiration: 'asc' },
  });
  return NextResponse.json(ingredients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, categoryId, quantity, unit, expiration, purchasedAt } = body;

  if (!name || !categoryId || !quantity || !unit || !expiration || !purchasedAt) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        categoryId,
        quantity,
        unit,
        expiration: new Date(expiration),
        purchasedAt: new Date(purchasedAt),
      },
      include: { category: true },
    });

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error('[POST /api/ingredients]', error);
    return NextResponse.json({ error: 'DB Error' }, { status: 500 });
  }
}
