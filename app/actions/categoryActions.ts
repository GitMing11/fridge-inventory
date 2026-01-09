'use server';

import { prisma } from "../../lib/prisma";
import { revalidatePath } from 'next/cache';

// 1. 카테고리 목록 조회
export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }, // 필요 시 정렬 추가
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Get Categories Error:', error);
    return { success: false, error: '카테고리 목록을 불러오지 못했습니다.' };
  }
}

// 2. 카테고리 생성
export async function createCategoryAction(name: string) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: '카테고리 이름이 필요합니다.' };
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    
    revalidatePath('/'); // 데이터 변경 반영
    return { success: true, data: category };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: '이미 존재하는 카테고리입니다.' };
    }
    console.error('Create Category Error:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}

// 3. 카테고리 수정
export async function updateCategoryAction(id: number, name: string) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
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