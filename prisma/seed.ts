// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 기본 그룹 생성
  const defaultGroup = await prisma.group.upsert({
    where: { code: 'default-family' }, // 고유 식별자용 코드
    update: {},
    create: {
      name: '기본 냉장고',
      code: 'default-family',
    },
  });

  console.log('🏠 기본 그룹 생성 완료:', defaultGroup.name);

  // 2. 카테고리 데이터 정의
  const categories = [
    { name: '채소', icon: '🥬', color: 'green' },
    { name: '과일', icon: '🍎', color: 'red' },
    { name: '육류', icon: '🥩', color: 'rose' },
    { name: '수산물', icon: '🐟', color: 'blue' },
    { name: '유제품', icon: '🥛', color: 'yellow' },
    { name: '양념', icon: '🥫', color: 'orange' },
    { name: '냉동', icon: '❄️', color: 'cyan' },
    { name: '기타', icon: '📦', color: 'gray' },
  ];

  console.log('🌱 카테고리 시딩 시작...');

  for (const cat of categories) {
    await prisma.category.upsert({
      // 복합 유니크 키(name + groupId)로 검색 조건 변경
      where: { 
        name_groupId: {
          name: cat.name,
          groupId: defaultGroup.id
        }
      },
      update: { icon: cat.icon, color: cat.color },
      create: { 
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        groupId: defaultGroup.id
      },
    });
  }

  console.log('✅ 카테고리 데이터 시딩 완료');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });