// types/index.ts

// ----------------------------------------------------------------------
// Core Content Types
// ----------------------------------------------------------------------

export interface Category {
  id: number;
  name: string;
  icon: string; 
  color: string;
  groupId: string;
}

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  category?: Category; // Prisma include 옵션으로 가져올 경우 포함됨 (선택적)
  
  groupId: string;      
  addedById?: string | null;

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
  groupId: string;
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

  groupId: string; 
  userId?: string | null;
}

// ----------------------------------------------------------------------
// User & Group Types
// ----------------------------------------------------------------------

export interface Group {
  id: string;        
  name: string;
  type: string;          // 'PERSONAL' | 'GROUP'
  code: string;
  createdAt: string;     // or Date
  updatedAt: string;     // or Date
}

export interface GroupMember {
  id: string;           
  role: string;          // 'OWNER' | 'ADMIN' | 'MEMBER'
  userId: string;
  groupId: string;
  user?: UserProfile;    // 멤버 목록 조회 시 유저 정보 포함 가능
}

export interface UserProfile {
  id: string;        
  email: string;
  name?: string | null;
  nickname?: string | null;
  image?: string | null;
  theme?: string | null;
}