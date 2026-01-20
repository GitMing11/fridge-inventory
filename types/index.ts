// types/index.ts

export interface Category {
  id: number;
  name: string;
  icon: string; 
  color: string;
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

export type IngredientInput = {
  name: string;
  categoryId: number;
  quantity: number;
  unit: string;
  expiration: string | Date;  // Date 객체나 문자열 둘 다 허용
  purchasedAt: string | Date;
};

export interface HistoryItem {
  id: number;
  name: string;
  categoryName: string;
  categoryColor: string;
  quantity: number;
  unit: string;
  expiration: string;
  purchasedAt: string;
  consumedAt: string;
  status: 'eaten' | 'discarded';
}