// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 아이콘과 색상을 포함한 초기 데이터 정의
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

  console.log('🌱 시딩 시작...');

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, color: cat.color },
      create: { 
        name: cat.name,
        icon: cat.icon,
        color: cat.color
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
