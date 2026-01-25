'use server';

import { prisma } from "../../lib/prisma";
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

interface AddIngredientParams {
  name: string;
  categoryId: number;
  quantity: number;
  unit: string;
  expiration: string | Date;
  purchasedAt: string | Date;
}

// [Helper] 현재 로그인한 유저의 DB 정보와 기본 그룹 ID 가져오기
async function getUserAndGroup(groupId?: number) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser || !authUser.email) {
    return { user: null, groupId: null, error: '로그인이 필요합니다.' };
  }

  // 이메일로 DB 유저 찾기
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
    include: { memberships: true } 
  });

  if (!user) {
    return { user: null, groupId: null, error: '사용자 정보를 찾을 수 없습니다.' };
  }

  // groupId가 지정되지 않았다면, 사용자의 첫 번째 그룹 사용
  let targetGroupId = groupId;
  if (!targetGroupId) {
    const firstMembership = user.memberships[0];
    if (firstMembership) {
      targetGroupId = firstMembership.groupId;
    }
  }

  if (!targetGroupId) {
    return { user, groupId: null, error: '속해있는 냉장고 그룹이 없습니다.' };
  }

  return { user, groupId: targetGroupId, error: null };
}

// --- 1. 재료 목록 조회 (그룹별) ---
export async function getIngredientsAction(groupId?: number) {
  try {
    const { groupId: targetGroupId, error } = await getUserAndGroup(groupId);
    if (error || !targetGroupId) {
        return { success: false, error: error || '그룹을 찾을 수 없습니다.' };
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { groupId: targetGroupId }, // [수정] 그룹 필터링 추가
      include: { category: true },
      orderBy: { expiration: 'asc' },
    });
    return { success: true, data: ingredients };
  } catch (error) {
    console.error('Get Ingredients Error:', error);
    return { success: false, error: '재료 목록을 불러오지 못했습니다.' };
  }
}

// --- 2. 재료 추가 ---
export async function addIngredientAction(data: AddIngredientParams, groupId?: number) {
  // 1. 유효성 검사
  const { name, categoryId, quantity, unit, expiration, purchasedAt } = data;
  
  if (!name || !categoryId || !quantity || !unit || !expiration || !purchasedAt) {
    return { success: false, error: '필수 항목이 누락되었습니다.' };
  }

  try {
    // 2. 유저 및 그룹 확인
    const { user, groupId: targetGroupId, error } = await getUserAndGroup(groupId);
    if (error || !targetGroupId || !user) return { success: false, error };

    // 3. DB 저장
    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        categoryId: Number(categoryId),
        quantity: Number(quantity),
        unit,
        expiration: new Date(expiration),
        purchasedAt: new Date(purchasedAt),
        groupId: targetGroupId,
        addedById: user.id,
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/');
    return { success: true, data: newIngredient };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, error: '재료 추가 중 오류가 발생했습니다.' };
  }
}

// --- 3. 재료 수정 ---
export async function updateIngredientAction(id: number, data: AddIngredientParams) {
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

// --- 2. 재료 소비/폐기 ---
export async function consumeIngredientAction(
  id: number,
  status: 'eaten' | 'discarded',
  quantity: number
) {
  try {
    // 로그인 유저 확인 (누가 소비했는지 기록하기 위해)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    let dbUserId: number | null = null;
    
    if (authUser?.email) {
         const user = await prisma.user.findUnique({ where: { email: authUser.email }});
         if (user) dbUserId = user.id;
    }

    // 트랜잭션으로 처리하여 데이터 무결성 보장
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
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
          categoryColor: ingredient.category.color,
          quantity: quantity,
          unit: ingredient.unit,
          expiration: ingredient.expiration,
          purchasedAt: ingredient.purchasedAt,
          consumedAt: new Date(),
          status,groupId: ingredient.groupId,
          userId: dbUserId,
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
  } catch (error: unknown) { 
    console.error('Consume Error:', error);
    const errorMessage = error instanceof Error ? error.message : '처리 실패';
    return { success: false, error: errorMessage };
  }
}

// --- 3. 일괄 소비/폐기 (Bulk Consume) ---
export async function bulkConsumeAction(ids: number[], status: 'eaten' | 'discarded') {
  try {
    // 로그인 유저 확인
     const supabase = await createClient();
     const { data: { user: authUser } } = await supabase.auth.getUser();
     let dbUserId: number | null = null;
     if (authUser?.email) {
          const user = await prisma.user.findUnique({ where: { email: authUser.email }});
          if (user) dbUserId = user.id;
    }
    
    await Promise.all(
      ids.map((id) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prisma.$transaction(async (tx: any) => {
          const item = await tx.ingredient.findUnique({ where: { id }, include: { category: true } });
          if (!item) return;

          await tx.ingredientHistory.create({
             data: {
                name: item.name,
                categoryName: item.category.name,
                categoryColor: item.category.color,
                quantity: item.quantity,
                unit: item.unit,
                expiration: item.expiration,
                purchasedAt: item.purchasedAt,
                consumedAt: new Date(),
                status,
                groupId: item.groupId,
                userId: dbUserId,
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