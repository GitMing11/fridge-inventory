// hooks/useInventory.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Category, Ingredient } from '../../types';

export function useInventory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, ingRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/ingredients')
        ]);
        setCategories(await catRes.json());
        setIngredients(await ingRes.json());
      } catch (error) {
        console.error('Failed to fetch data', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      }
    };
    fetchData();
  }, []);

  // 개별 소비/폐기 처리
  const consumeIngredient = async (item: Ingredient, status: 'eaten' | 'discarded', quantity: number) => {
    const res = await fetch(`/api/ingredients/${item.id}/consume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, quantity }),
    });

    if (res.ok) {
      if (quantity >= item.quantity) {
        setIngredients((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setIngredients((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i
          )
        );
      }
      return true;
    } else {
      toast.error('처리 실패');
      return false;
    }
  };

  // 일괄 소비/폐기 처리
  const bulkConsumeIngredients = async (ids: number[], status: 'eaten' | 'discarded') => {
    try {
      const res = await fetch('/api/ingredients/bulk-consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });

      if (res.ok) {
        setIngredients((prev) => prev.filter((i) => !ids.includes(i.id)));
        const actionText = status === 'eaten' ? '소비' : '폐기';
        toast.success(`${ids.length}개의 재료가 ${actionText}되었습니다.`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || '일괄 처리에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      toast.error('서버 통신 오류가 발생했습니다.');
    }
  };

  // 재료 추가 핸들러
  const addIngredient = (newItem: Ingredient) => {
    setIngredients((prev) => [...prev, newItem]);
  };

  // 재료 수정 핸들러
  const updateIngredient = (updatedItem: Ingredient) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
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