import React from 'react';
import { Plus } from 'lucide-react';

interface HomeHeaderProps {
	onAddClick: () => void;
}

export default function HomeHeader({ onAddClick }: HomeHeaderProps) {
	return (
		<section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
					냉장고 재고 관리
				</h2>
				<p className="text-muted-foreground text-lg">
					식재료를 효율적으로 관리해보세요.
				</p>
			</div>
			<button
				onClick={onAddClick}
				className="group flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-base font-bold shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95"
			>
				<Plus
					className="w-5 h-5"
					strokeWidth={3}
				/>
				재료 추가하기
			</button>
		</section>
	);
}
