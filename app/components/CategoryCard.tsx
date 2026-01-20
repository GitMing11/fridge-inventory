'use client';

import { MoreHorizontal } from 'lucide-react';
import { Category } from '../../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryCardProps {
	category: Category;
	onEdit: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
	const colorKey = (category.color || 'gray') as keyof typeof CATEGORY_COLORS;
	const colorClass = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS.gray;

	return (
		<div
			onClick={() => onEdit(category)}
			className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${colorClass}`}
		>
			{/* 이모티콘 */}
			<span className="text-4xl drop-shadow-sm filter">{category.icon}</span>

			{/* 이름 */}
			<span className="text-lg font-bold">{category.name}</span>

			{/* 우측 상단 메뉴 아이콘 (시각적 힌트용) */}
			<div className="absolute right-3 top-3 opacity-30 transition-opacity hover:opacity-100">
				<MoreHorizontal size={20} />
			</div>
		</div>
	);
}
