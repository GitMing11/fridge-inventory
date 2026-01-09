'use server';

import { prisma } from "../../lib/prisma";

export async function getHistoryAction() {
  try {
    const history = await prisma.ingredientHistory.findMany({
      orderBy: { consumedAt: 'desc' },
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('History Action Error:', error);
    return { success: false, error: '히스토리를 불러오는데 실패했습니다.' };
  }
}