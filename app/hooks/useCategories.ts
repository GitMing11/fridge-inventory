import { useState, useEffect, useCallback } from 'react';
import { Category } from '../../types';
import { 
  getCategoriesAction, 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '../actions/categoryActions';
import toast from 'react-hot-toast';

export function useCategories(groupId?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
const fetchCategories = useCallback(async () => {
    setLoading(true);
    const result = await getCategoriesAction(groupId);
    
    if (result.success && result.data) {
      setCategories(result.data as Category[]);
    } else {
      toast.error(result.error || '카테고리 로딩 실패');
    }
    setLoading(false);
  }, [groupId]);

  // 초기 데이터 로드 및 groupId 변경 시 재로딩
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 1. 카테고리 추가
  const addCategory = async (name: string, icon: string, color: string) => {
  
    if (!groupId) {
        toast.error('그룹 정보가 없습니다.');
        return false;
    }
    const result = await createCategoryAction(name, icon, color, groupId);
    
    if (result.success && result.data) {
      setCategories((prev) => [...prev, result.data as Category]);
      toast.success('카테고리가 추가되었습니다.');
      return true;
    } else {
      toast.error(result.error || '추가 실패');
      return false;
    }
  };

  // 2. 카테고리 수정
  const updateCategory = async (id: number, name: string, icon: string, color: string) => {
    const result = await updateCategoryAction(id, name, icon, color);

    if (result.success && result.data) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? (result.data as Category) : cat))
      );
      toast.success('카테고리가 수정되었습니다.');
      return true;
    } else {
      toast.error(result.error || '수정 실패');
      return false;
    }
  };

  // 3. 카테고리 삭제
  const deleteCategory = async (id: number) => {
    const result = await deleteCategoryAction(id);

    if (result.success) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success('카테고리가 삭제되었습니다.');
      return true;
    } else {
      toast.error(result.error || '삭제 실패');
      return false;
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };
}