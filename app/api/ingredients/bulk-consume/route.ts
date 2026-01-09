import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { ids, status } = await request.json(); // ids: number[]

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '선택된 재료가 없습니다.' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 일괄 처리
    await prisma.$transaction(async (tx) => {
      // 1. 선택된 재료 정보 조회 (기록 생성을 위해)
      const ingredients = await tx.ingredient.findMany({
        where: { id: { in: ids } },
        include: { category: true },
      });

      // 2. 기록(History) 생성
      for (const item of ingredients) {
        await tx.ingredientHistory.create({
          data: {
            name: item.name,
            categoryName: item.category?.name || '미분류',
            quantity: item.quantity,
            unit: item.unit,
            expiration: item.expiration,
            purchasedAt: item.purchasedAt,
            status: status, // 'eaten' | 'discarded'
          },
        });
      }

      // 3. 재료 삭제 (전량 소비/폐기이므로 삭제)
      await tx.ingredient.deleteMany({
        where: { id: { in: ids } },
      });
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Bulk consume error:', error);
    return NextResponse.json(
      { error: '일괄 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}