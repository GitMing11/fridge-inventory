'use client';

import React, { useEffect } from 'react';
import { Ingredient } from '../../../types';
import { X, Calendar, Tag, Package, Clock, ShoppingBag } from 'lucide-react';
import { getDDay, formatDate } from '../../utils/dateUtils';
import DDayBadge from './DDayBadge';
import InfoCard from './InfoCard';

interface Props {
	item: Ingredient;
	onClose: () => void;
}

export default function IngredientDetailModal({ item, onClose }: Props) {
	const dDay = getDDay(item.expiration);
	const isUrgent = dDay >= 0 && dDay <= 3;

	// 1. 카테고리 정보 추출 (없을 경우 기본값 설정)
	const categoryName = item.category?.name || '미분류';
	const categoryIcon = item.category?.icon || '🥡';
	// 카테고리 색상 키 (예: 'green', 'red'...)
	const colorKey = item.category?.color || 'gray';

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [onClose]);

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-sm transition-opacity p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-full max-w-[450px] overflow-hidden rounded-3xl bg-card border border-card-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
			>
				<div
					className={`relative h-32 border-b transition-colors duration-300
            bg-${colorKey}-100 border-${colorKey}-200 
            dark:bg-${colorKey}-900/30 dark:border-${colorKey}-800/50
          `}
				>
					{/* 닫기 버튼 */}
					<button
						onClick={onClose}
						className="absolute right-5 top-5 rounded-full p-2 bg-card/80 text-muted-foreground transition-colors hover:bg-card hover:text-foreground shadow-sm hover:shadow-md backdrop-blur-sm"
					>
						<X size={20} />
					</button>

					{/* 아이콘 영역 */}
					<div className="absolute -bottom-10 left-8 flex items-end gap-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-card-border shadow-lg text-4xl">
							{categoryIcon}
						</div>
					</div>
				</div>

				{/* 본문 */}
				<div className="pt-14 px-8 pb-8 flex flex-col gap-6">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h2 className="text-2xl font-bold text-foreground">
								{item.name}
							</h2>
							<DDayBadge dDay={dDay} />
						</div>
						{/* 태그 부분도 카테고리 색상으로 깔맞춤하면 예쁩니다 (선택사항) */}
						<div
							className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium 
                bg-${colorKey}-100 text-${colorKey}-700 
                dark:bg-${colorKey}-900/50 dark:text-${colorKey}-300`}
						>
							<Tag size={12} />
							{categoryName}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<InfoCard
							icon={<ShoppingBag size={18} />}
							label="수량"
							value={`${item.quantity} ${item.unit}`}
						/>
						<InfoCard
							icon={<Calendar size={18} />}
							label="유통기한"
							value={formatDate(item.expiration)}
							highlight={isUrgent}
						/>
						<InfoCard
							icon={<Clock size={18} />}
							label="구매일"
							value={formatDate(item.purchasedAt)}
						/>
						<InfoCard
							icon={<Package size={18} />}
							label="등록일"
							value={formatDate(item.createdAt)}
						/>
					</div>

					<button
						onClick={onClose}
						className="mt-2 w-full rounded-xl bg-input-bg border border-input-border py-3.5 text-base font-bold text-muted-foreground transition-all hover:bg-card-border hover:text-foreground active:scale-[0.98]"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
}
