'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { useCategories } from '../../hooks/useCategories';
import CategoryHeader from '../../components/ui/CategoryHeader';
import CategoryCard from '../../components/CategoryCard';
import CategoryFormModal from '../../components/CategoryFormModal';
import { Category } from '../../../types';

export default function CategoriesPage() {
	const { categories, addCategory, updateCategory, deleteCategory } =
		useCategories();

	// 모달 상태 관리
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	// 추가 버튼 클릭 시
	const handleAddClick = () => {
		setEditingCategory(null); // 초기화
		setIsModalOpen(true);
	};

	// 카드 클릭(수정) 시
	const handleEditClick = (category: Category) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	// 폼 제출 핸들러 (추가/수정 분기)
	const handleFormSubmit = async (
		name: string,
		icon: string,
		color: string
	) => {
		if (editingCategory) {
			await updateCategory(editingCategory.id, name, icon, color);
		} else {
			await addCategory(name, icon, color);
		}
	};

	// 삭제 핸들러
	const handleDelete = async () => {
		if (
			editingCategory &&
			confirm(
				'정말 삭제하시겠습니까? \n(포함된 재료가 있다면 삭제되지 않습니다)'
			)
		) {
			await deleteCategory(editingCategory.id);
			setIsModalOpen(false);
		}
	};

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
				{/* 1. Header */}
				<CategoryHeader />

				{/* 그리드 레이아웃 */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{/* 1. 카테고리 카드들 */}
					{categories.map((cat) => (
						<CategoryCard
							key={cat.id}
							category={cat}
							onEdit={handleEditClick}
						/>
					))}

					{/* 2. 추가하기 버튼 (마지막 카드) */}
					<button
						onClick={handleAddClick}
						className="group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-neutral bg-transparent text-muted-foreground transition-all hover:border-primary hover:bg-info hover:text-text-brand active:scale-95"
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral transition-colors group-hover:bg-background/50">
							<Plus size={24} />
						</div>
						<span className="font-medium">카테고리 추가</span>
					</button>
				</div>
			</div>

			{/* 모달 */}
			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleFormSubmit}
				onDelete={editingCategory ? handleDelete : undefined}
				initialData={editingCategory}
			/>
		</div>
	);
}
