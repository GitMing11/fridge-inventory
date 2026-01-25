'use server';

import { prisma } from "../../lib/prisma";
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

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
    include: { memberships: true } // 멤버십 정보 포함
  });

  if (!user) {
    return { user: null, groupId: null, error: '사용자 정보를 찾을 수 없습니다.' };
  }

  // groupId가 지정되지 않았다면, 사용자의 첫 번째 그룹(보통 개인 냉장고)을 사용
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

// 1. 카테고리 목록 조회 (그룹별 조회)
export async function getCategoriesAction(groupId?: number) {
  try {
    const { groupId: targetGroupId, error } = await getUserAndGroup(groupId);
    if (error || !targetGroupId) {
       // 비로그인 상태거나 그룹이 없으면 빈 배열 혹은 에러 반환
       // (UI 처리에 따라 다르지만 여기선 빈 배열 반환으로 처리)
       return { success: false, error: error || '그룹을 찾을 수 없습니다.' };
    }

    const categories = await prisma.category.findMany({
      where: { groupId: targetGroupId }, // 그룹 ID로 필터링
      orderBy: { id: 'asc' },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Get Categories Error:', error);
    return { success: false, error: '카테고리 목록을 불러오지 못했습니다.' };
  }
}

// 2. 카테고리 생성
export async function createCategoryAction(name: string, icon: string, color: string, groupId?: number) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: '카테고리 이름이 필요합니다.' };
  }

  try {
    // 유저 및 그룹 ID 확인
    const { groupId: targetGroupId, error } = await getUserAndGroup(groupId);
    if (error || !targetGroupId) return { success: false, error };

    const category = await prisma.category.create({
      data: { 
        name,
        icon: icon || '📦',
        color: color || 'gray',
        groupId: targetGroupId, // [수정됨] 필수 필드인 groupId 추가
      },
    });
    
    revalidatePath('/');
    revalidatePath('/categories');
    return { success: true, data: category };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: '이 냉장고에 이미 존재하는 카테고리입니다.' };
    }
    console.error('Create Category Error:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}

// 3. 카테고리 수정
export async function updateCategoryAction(id: number, name: string, icon: string, color: string) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, icon, color },
    });

    revalidatePath('/');
    return { success: true, data: category };
  } catch (error) {
    console.error('Update Category Error:', error);
    return { success: false, error: '카테고리 수정 실패' };
  }
}

// 4. 카테고리 삭제
export async function deleteCategoryAction(id: number) {
  try {
    // 1. 해당 카테고리를 사용 중인 재료가 있는지 확인
    const ingredientsCount = await prisma.ingredient.count({
      where: { categoryId: id },
    });

    if (ingredientsCount > 0) {
      return { 
        success: false, 
        error: '이 카테고리에 속한 재료가 있어 삭제할 수 없습니다. 재료를 먼저 삭제하거나 이동해주세요.' 
      };
    }

    // 2. 사용 중인 재료가 없으면 삭제 진행
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete Category Error:', error);
    return { success: false, error: '카테고리 삭제 실패' };
  }
}