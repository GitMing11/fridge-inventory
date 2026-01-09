import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Category } from '../../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  // 조회
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('카테고리 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 추가
  const addCategory = async (name: string) => {
    if (!name.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      fetchCategories(); // 목록 갱신
      return true;
    } else {
      toast.error('추가 실패');
      return false;
    }
  };

  // 수정
  const updateCategory = async (id: number, name: string) => {
    if (!name.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      fetchCategories();
      return true;
    } else {
      toast.error('수정 실패');
      return false;
    }
  };

  // 삭제
  const deleteCategory = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchCategories();
      return true;
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || '삭제 실패');
      return false;
    }
  };

  return { categories, addCategory, updateCategory, deleteCategory };
}