import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Category } from '../../../types';

interface FilterBarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	selectedCategory: number | 'all';
	onCategoryChange: (value: number | 'all') => void;
	categories: Category[];
}

export default function FilterBar({
	searchTerm,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	categories,
}: FilterBarProps) {
	return (
		<div className="flex flex-col md:flex-row gap-4">
			{/* 검색창 */}
			<div className="relative grow">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
				<input
					type="text"
					placeholder="재료 이름 검색..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full h-12 rounded-2xl border border-card-border bg-card px-12 text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 hover:shadow-md outline-none"
				/>
			</div>

			{/* 필터 */}
			<div className="relative min-w-[180px]">
				<Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
				<select
					value={selectedCategory}
					onChange={(e) =>
						onCategoryChange(
							e.target.value === 'all' ? 'all' : Number(e.target.value)
						)
					}
					className="w-full h-12 appearance-none rounded-2xl border border-card-border bg-card pl-11 pr-10 text-foreground shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 hover:shadow-md cursor-pointer outline-none"
				>
					<option value="all">전체보기</option>
					{categories.map((cat) => (
						<option
							key={cat.id}
							value={cat.id}
						>
							{cat.name}
						</option>
					))}
				</select>

				<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
					<ChevronDown className="h-3 w-3" />
				</div>
			</div>
		</div>
	);
}
