'use server';

import { prisma } from "../../lib/prisma";
import { revalidatePath } from 'next/cache';

interface AddIngredientParams {
  name: string;
  categoryId: number;
  quantity: number;
  unit: string;
  expiration: string | Date;
  purchasedAt: string | Date;
}

export async function getIngredientsAction() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: { category: true },
      orderBy: { expiration: 'asc' },
    });
    return { success: true, data: ingredients };
  } catch (error) {
    console.error('Get Ingredients Error:', error);
    return { success: false, error: '재료 목록을 불러오지 못했습니다.' };
  }
}

export async function addIngredientAction(data: AddIngredientParams) {
  // 1. 유효성 검사
  const { name, categoryId, quantity, unit, expiration, purchasedAt } = data;
  
  if (!name || !categoryId || !quantity || !unit || !expiration || !purchasedAt) {
    return { success: false, error: '필수 항목이 누락되었습니다.' };
  }

  try {
    // 2. DB 저장
    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        categoryId: Number(categoryId),
        quantity: Number(quantity),
        unit,
        expiration: new Date(expiration),
        purchasedAt: new Date(purchasedAt),
      },
      include: {
        category: true, // 프론트엔드 업데이트를 위해 카테고리 정보 포함
      },
    });

    // 3. 캐시 갱신 (홈 페이지 데이터 새로고침 트리거)
    revalidatePath('/');

    // 4. 결과 반환 (직렬화 가능한 객체여야 함)
    return { success: true, data: newIngredient };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, error: '재료 추가 중 오류가 발생했습니다.' };
  }
}

// --- 1. 재료 수정 (Update) ---
export async function updateIngredientAction(id: number, data: any) {
  const { name, categoryId, quantity, unit, expiration, purchasedAt } = data;

  try {
    const updated = await prisma.ingredient.update({
      where: { id },
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

    revalidatePath('/'); // 데이터 변경 알림
    return { success: true, data: updated };
  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: '재료 수정에 실패했습니다.' };
  }
}

// --- 2. 재료 소비/폐기 (Consume) ---
export async function consumeIngredientAction(
  id: number,
  status: 'eaten' | 'discarded',
  quantity: number
) {
  try {
    // 트랜잭션으로 처리하여 데이터 무결성 보장
    const result = await prisma.$transaction(async (tx) => {
      const ingredient = await tx.ingredient.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!ingredient) throw new Error('Ingredient not found');
      if (quantity <= 0 || quantity > ingredient.quantity) {
        throw new Error('유효하지 않은 수량입니다.');
      }

      const remaining = ingredient.quantity - quantity;

      // 1. 이력 저장
      await tx.ingredientHistory.create({
        data: {
          name: ingredient.name,
          categoryName: ingredient.category.name,
          quantity: quantity,
          unit: ingredient.unit,
          expiration: ingredient.expiration,
          purchasedAt: ingredient.purchasedAt,
          consumedAt: new Date(),
          status,
        },
      });

      // 2. 재료 업데이트 또는 삭제
      if (remaining > 0) {
        await tx.ingredient.update({
          where: { id },
          data: { quantity: remaining },
        });
      } else {
        await tx.ingredient.delete({ where: { id } });
      }
      
      return { remaining };
    });

    revalidatePath('/');
    return { success: true, remaining: result.remaining };
  } catch (error: any) {
    console.error('Consume Error:', error);
    return { success: false, error: error.message || '처리 실패' };
  }
}

// --- 3. 일괄 소비/폐기 (Bulk Consume) ---
export async function bulkConsumeAction(ids: number[], status: 'eaten' | 'discarded') {
  try {
    await Promise.all(
      ids.map((id) => 
        prisma.$transaction(async (tx) => {
          const item = await tx.ingredient.findUnique({ where: { id }, include: { category: true } });
          if (!item) return;

          await tx.ingredientHistory.create({
             data: {
                name: item.name,
                categoryName: item.category.name,
                quantity: item.quantity,
                unit: item.unit,
                expiration: item.expiration,
                purchasedAt: item.purchasedAt,
                consumedAt: new Date(),
                status
             }
          });
          await tx.ingredient.delete({ where: { id } });
        })
      )
    );

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Bulk Error:', error);
    return { success: false, error: '일괄 처리에 실패했습니다.' };
  }
}