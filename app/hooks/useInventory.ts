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
          // DB의 Date 객체를 프론트엔드에서 사용하는 형식(String)으로 변환
          const formattedIngredients = ingResult.data.map(item => ({
            ...item,
            expiration: new Date(item.expiration).toISOString(),
            purchasedAt: new Date(item.purchasedAt).toISOString(),
            createdAt: new Date(item.createdAt).toISOString(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
          }));
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
    const result = await addIngredientAction(newItemData);
    
    if (result.success && result.data) {
      const newIngredient: Ingredient = {
        ...result.data,
        expiration: new Date(result.data.expiration).toISOString(),
        purchasedAt: new Date(result.data.purchasedAt).toISOString(),
        createdAt: new Date(result.data.createdAt).toISOString(),
        updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt).toISOString() : undefined,
        category: result.data.category,
      };

      setIngredients((prev) => [...prev, newIngredient]);
      return true;
    } else {
      toast.error(result.error || '추가 실패');
      return false;
    }
  };

  // 2. 재료 수정 (기존 단순 상태 변경 -> 서버 액션 호출로 변경)
const updateIngredient = async (item: Ingredient) => {
    // 1. item 객체에서 id와 나머지 데이터를 분리하거나 필요한 데이터만 추출
    const { id } = item;
    
    // 2. Server Action에 보낼 데이터 포맷팅 (불필요한 필드 제거 및 타입 맞추기)
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