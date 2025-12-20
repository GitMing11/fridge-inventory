// types/index.ts

export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  category?: Category; // Prisma include 옵션으로 가져올 경우 포함됨 (선택적)
  quantity: number;
  unit: string;
  expiration: string; // JSON 직렬화 후 넘어오므로 string 처리
  purchasedAt: string;
  createdAt: string;
  updatedAt?: string; // 업데이트 날짜는 없을 수도 있음
}