import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// 1. DATABASE_URL 파싱
const connectionString = process.env.DATABASE_URL || "";

let url: URL;
try {
  url = new URL(connectionString);
} catch (error) {
  console.warn("Invalid or missing DATABASE_URL, using default.");
  // 기본값 설정 (필요에 따라 수정)
  url = new URL("mysql://root:1234@localhost:3306/fridge_db");
}

// 2. Prisma 어댑터 생성 (Pool 인스턴스가 아닌 설정 객체를 직접 전달)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // '/' 제거
  connectionLimit: 5, // 연결 수 제한 옵션 등도 여기에 포함
});

// 3. 어댑터를 사용하여 PrismaClient 초기화
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;