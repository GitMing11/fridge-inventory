// app/hooks/useIngredientForm.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Category, Ingredient, IngredientInput } from '../../types';
import { getToday, formatDateInput } from '../utils/dateUtils';
import { createCategoryAction } from '../actions/categoryActions';

interface UseIngredientFormProps {
  initialData?: Ingredient | null;
  onAdd: (newItem: IngredientInput) => Promise<boolean>;
  onUpdate?: (updatedItem: Ingredient) => Promise<boolean>;
  onClose: () => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function useIngredientForm({
  initialData,
  onAdd,
  onUpdate,
  onClose,
  setCategories,
}: UseIngredientFormProps) {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    categoryId: 0,
    quantity: 0,
    unit: '',
    expiration: getToday(),
    purchasedAt: getToday(),
  });

  const [newCategory, setNewCategory] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData) {
      setNewIngredient({
        name: initialData.name,
        categoryId: initialData.categoryId,
        quantity: initialData.quantity,
        unit: initialData.unit,
        expiration: formatDateInput(initialData.expiration),
        purchasedAt: formatDateInput(initialData.purchasedAt),
      });
    }
  }, [initialData]);

  // 핸들러: 입력값 변경
  const handleChange = (field: string, value: any) => {
    setNewIngredient((prev) => ({ ...prev, [field]: value }));
  };

  // 핸들러: 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const result = await createCategoryAction(newCategory.trim());

      if (result.success && result.data) {
        setCategories((prev) => [...prev, result.data as Category]);
        handleChange('categoryId', result.data.id); 
        setNewCategory('');
        toast.success('카테고리가 추가되었습니다.');
      } else {
        toast.error(result.error || '카테고리 추가 실패');
      }
    } catch (e) {
      console.error(e);
      toast.error('오류가 발생했습니다.');
    }
  };

  // 핸들러: 폼 제출
  const handleSubmit = async () => {
    const { name, categoryId, quantity, unit, expiration, purchasedAt } = newIngredient;

    if (!name || !categoryId || !unit || !expiration || !purchasedAt) {
      toast.error('모든 필드를 채워주세요.');
      return;
    }

    try {
      let success = false;

      if (initialData && onUpdate) {
        // 부모(useInventory)에서 받은 onUpdate 함수 호출
        // 기존 데이터를 기반으로 ID와 업데이트된 필드를 합침
        const updatedItem: Ingredient = {
          ...initialData,
          ...newIngredient,
          categoryId: Number(categoryId),
          quantity: Number(quantity),
        };
        
        success = await onUpdate(updatedItem);
        if (success) {
           toast.success('재료가 수정되었습니다!');
           onClose();
        }
      } else {
        // 부모(useInventory)에서 받은 onAdd 함수 호출
        const newItem: IngredientInput = {
          name,
          categoryId: Number(categoryId),
          quantity: Number(quantity),
          unit,
          expiration,
          purchasedAt,
        };

        success = await onAdd(newItem);
        if (success) {
           toast.success('새 재료가 추가되었습니다!');
           onClose();
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('오류가 발생했습니다.');
    }
  };

  return {
    newIngredient,
    newCategory,
    setNewCategory,
    handleChange,
    handleAddCategory,
    handleSubmit,
  };
}