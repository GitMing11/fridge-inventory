'use client';

import React, { useState } from 'react';
import { FolderOpen } from 'lucide-react';

import { useCategories } from '../../hooks/useCategories';
import CategoryHeader from '../../components/ui/CategoryHeader';
import CategoryForm from '../../components/CategoryForm';
import CategoryItem from '../../components/CategoryItem';

export default function CategoriesPage() {
	const { categories, addCategory, updateCategory, deleteCategory } =
		useCategories();

	// 현재 수정 중인 카테고리 ID (한 번에 하나만 수정 가능하도록 Page에서 관리)
	const [editingId, setEditingId] = useState<number | null>(null);

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
				{/* 1. Header */}
				<CategoryHeader />

				{/* 2. Add Form */}
				<CategoryForm onAdd={addCategory} />

				{/* 3. List */}
				<div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm">
					<ul className="divide-y divide-card-border">
						{categories.map((cat) => (
							<CategoryItem
								key={cat.id}
								category={cat}
								isEditing={editingId === cat.id}
								onEditStart={() => setEditingId(cat.id)}
								onEditCancel={() => setEditingId(null)}
								onUpdate={updateCategory}
								onDelete={deleteCategory}
							/>
						))}

						{/* Empty State */}
						{categories.length === 0 && (
							<li className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-input-bg">
									<FolderOpen
										size={24}
										className="opacity-50"
									/>
								</div>
								<p>등록된 카테고리가 없습니다.</p>
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
