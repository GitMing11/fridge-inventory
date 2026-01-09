// app/hooks/useIngredientForm.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Category, Ingredient } from '../../types';
import { getToday, formatDateInput } from '../utils/dateUtils';

interface UseIngredientFormProps {
  initialData?: Ingredient | null;
  onAdd: (newItem: Ingredient) => void;
  onUpdate?: (updatedItem: Ingredient) => void;
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
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        handleChange('categoryId', created.id);
        setNewCategory('');
        toast.success('카테고리가 추가되었습니다.');
      } else {
        toast.error('카테고리 추가 실패');
      }
    } catch (e) {
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
      if (initialData && onUpdate) {
        // 수정
        const res = await fetch(`/api/ingredients/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIngredient),
        });

        if (res.ok) {
          const updated = await res.json();
          onUpdate(updated);
          onClose();
          toast.success('재료가 수정되었습니다!');
        } else {
          toast.error('수정 실패');
        }
      } else {
        // 추가
        const res = await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIngredient),
        });

        if (res.ok) {
          const added = await res.json();
          onAdd(added);
          onClose();
          toast.success('새 재료가 추가되었습니다!');
        } else {
          toast.error('추가 실패');
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