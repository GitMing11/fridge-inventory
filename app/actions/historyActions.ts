'use server';

import { prisma } from "../../lib/prisma";
import { createClient } from "../../lib/supabase/server";

//  유저 및 그룹 확인
async function getUserAndGroup(groupId?: string) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser || !authUser.email) {
    return { user: null, groupId: null, error: '로그인이 필요합니다.' };
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
    include: { memberships: true }
  });

  if (!user) {
    return { user: null, groupId: null, error: '사용자 정보를 찾을 수 없습니다.' };
  }

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

export async function getHistoryAction(groupId?: string) {
  try {
    const { groupId: targetGroupId, error } = await getUserAndGroup(groupId);
    if (error || !targetGroupId) {
      return { success: false, error: error || '그룹을 찾을 수 없습니다.' };
    }

    const history = await prisma.ingredientHistory.findMany({
      where: { groupId: targetGroupId },
      orderBy: { consumedAt: 'desc' },
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('History Action Error:', error);
    return { success: false, error: '히스토리를 불러오는데 실패했습니다.' };
  }
}