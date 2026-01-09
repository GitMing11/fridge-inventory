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

	// ESC 키로 모달 닫기 기능
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
				{/* 헤더 */}
				<div className="relative h-32 bg-input-bg border-b border-card-border">
					<button
						onClick={onClose}
						className="absolute right-5 top-5 rounded-full p-2 bg-card text-muted-foreground transition-colors hover:text-foreground shadow-sm hover:shadow-md"
					>
						<X size={20} />
					</button>
					<div className="absolute -bottom-10 left-8 flex items-end gap-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-card-border shadow-lg text-4xl">
							🥡
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
						<p className="text-sm text-muted-foreground flex items-center gap-1.5">
							<Tag size={14} />
							{item.category?.name || '미분류'}
						</p>
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
