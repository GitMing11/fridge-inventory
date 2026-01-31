// hooks/useInventory.ts
import { useState, useEffect } from 'react';
import { Category, Ingredient } from '../../types';
import {
  getIngredientsAction,
  addIngredientAction, 
  updateIngredientAction, 
  consumeIngredientAction,
  bulkConsumeAction
} from '../actions/ingredientActions';
import { getCategoriesAction } from '../actions/categoryActions';
import toast from 'react-hot-toast';
import { IngredientInput } from '../../types';

interface DbIngredient {
  id: number;
  name: string;
  categoryId: number;
  quantity: number;
  unit: string;
  expiration: Date;
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
  category?: Category;
  groupId: string;
}

export function useInventory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // 초기 데이터 로드
useEffect(() => {
    const fetchData = async () => {
      try {
        // 병렬로 데이터 요청
        const [catResult, ingResult] = await Promise.all([
          getCategoriesAction(),
          getIngredientsAction()
        ]);

        // 카테고리 설정
        if (catResult.success && catResult.data) {
          setCategories(catResult.data);
        } else {
          toast.error(catResult.error || '카테고리 로딩 실패');
        }

        // 재료 설정
        if (ingResult.success && ingResult.data) {
          const dbData = ingResult.data as DbIngredient[];
          const formattedIngredients = dbData.map((item) => ({
            ...item,
            expiration: new Date(item.expiration).toISOString(),
            purchasedAt: new Date(item.purchasedAt).toISOString(),
            createdAt: new Date(item.createdAt).toISOString(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
            category: item.category,
            groupId: item.groupId || '',
          })) as Ingredient[];
          
          setIngredients(formattedIngredients);
        } else {
          toast.error(ingResult.error || '재료 로딩 실패');
        }

      } catch (error) {
        console.error('Failed to fetch data', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      }
    };
    fetchData();
  }, []);

  // 1. 재료 추가
const addIngredient = async (newItemData: IngredientInput) => {
  const { groupId, ...restData } = newItemData;

  const result = await addIngredientAction(restData, groupId);

    if (result.success && result.data) {
      const newIngredient: Ingredient = {
        ...result.data,
        expiration: new Date(result.data.expiration).toISOString(),
        purchasedAt: new Date(result.data.purchasedAt).toISOString(),
        createdAt: new Date(result.data.createdAt).toISOString(),
        updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt).toISOString() : undefined,
        category: result.data.category,
        groupId: result.data.groupId,
      };

      setIngredients((prev) => [...prev, newIngredient]);
      return true;
    } else {
      toast.error(result.error || '추가 실패');
      return false;
    }
  };

  // 2. 재료 수정
const updateIngredient = async (item: Ingredient) => {
    const { id } = item;
    
    const updateData = {
      name: item.name,
      categoryId: Number(item.categoryId),
      quantity: Number(item.quantity),
      unit: item.unit,
      expiration: item.expiration,   // string | Date
      purchasedAt: item.purchasedAt, // string | Date
    };

    // 3. Server Action 호출 (id와 데이터 분리해서 전달)
    const result = await updateIngredientAction(id, updateData);
    
    if (result.success && result.data) {
      // 4. 성공 시 로컬 상태 업데이트
      const updatedIngredient: Ingredient = {
        ...result.data,
        expiration: new Date(result.data.expiration).toISOString(),
        purchasedAt: new Date(result.data.purchasedAt).toISOString(),
        createdAt: new Date(result.data.createdAt).toISOString(),
        updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt).toISOString() : undefined,
        category: result.data.category,
        groupId: result.data.groupId,
      };

      setIngredients((prev) =>
        prev.map((i) => (i.id === id ? updatedIngredient : i))
      );
      return true;
    } else {
      toast.error(result.error || '수정 실패');
      return false;
    }
  };

  // 3. 재료 소비
  const consumeIngredient = async (item: Ingredient, status: 'eaten' | 'discarded', quantity: number) => {
    const result = await consumeIngredientAction(item.id, status, quantity);

    if (result.success) {
      // 남은 수량이 0 이하면 목록에서 제거, 아니면 수량 업데이트
      if (typeof result.remaining === 'number' && result.remaining > 0) {
         setIngredients((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: result.remaining! } : i
          )
        );
      } else {
        setIngredients((prev) => prev.filter((i) => i.id !== item.id));
      }
      toast.success('처리되었습니다.');
      return true;
    } else {
      toast.error(result.error || '처리 실패');
      return false;
    }
  };

  // 4. 일괄 처리
  const bulkConsumeIngredients = async (ids: number[], status: 'eaten' | 'discarded') => {
    const result = await bulkConsumeAction(ids, status);
    
    if (result.success) {
      setIngredients((prev) => prev.filter((i) => !ids.includes(i.id)));
      toast.success('일괄 처리되었습니다.');
    } else {
      toast.error(result.error || '일괄 처리 실패');
    }
  };

  return {
    categories,
    setCategories,
    ingredients,
    consumeIngredient,
    bulkConsumeIngredients,
    addIngredient,
    updateIngredient
  };
}