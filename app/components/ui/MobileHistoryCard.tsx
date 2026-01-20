import React from 'react';
import { Tag, CheckCircle2, Trash2, ShoppingBag, Calendar } from 'lucide-react';
import { HistoryItem } from '../../../types';
import { CATEGORY_COLORS } from '../../constants';

interface ExtendedHistoryItem extends HistoryItem {
	category?: { color: string };
}

export default function MobileHistoryCard({ item }: { item: HistoryItem }) {
	const isEaten = item.status === 'eaten';

	const extendedItem = item as ExtendedHistoryItem;

	const rawColor =
		extendedItem.categoryColor || extendedItem.category?.color || 'gray';

	const colorKey = rawColor as keyof typeof CATEGORY_COLORS;
	const colorClass = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS['gray'];

	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-5 shadow-sm">
			{/* 상단: 카테고리 & 상태 뱃지 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<Tag size={12} />
					<span
						className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors ${colorClass}`}
					>
						{item.categoryName}
					</span>
				</div>
				<span
					className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
						isEaten
							? 'bg-success/10 text-success-foreground'
							: 'bg-danger/10 text-danger-foreground'
					}`}
				>
					{isEaten ? <CheckCircle2 size={12} /> : <Trash2 size={12} />}
					{isEaten ? '사용 완료' : '폐기됨'}
				</span>
			</div>

			{/* 메인: 이름 & 수량 */}
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-bold text-foreground">{item.name}</h3>
				<div className="flex items-center gap-1.5 text-foreground">
					<ShoppingBag
						size={14}
						className="text-muted-foreground"
					/>
					<span className="font-semibold">{item.quantity}</span>
					<span className="text-sm text-muted-foreground">{item.unit}</span>
				</div>
			</div>

			{/* 하단: 날짜 정보 */}
			<div className="mt-1 flex items-center gap-2 border-t border-card-border pt-3 text-xs text-muted-foreground">
				<Calendar size={12} />
				<span>처리일: {new Date(item.consumedAt).toLocaleDateString()}</span>
			</div>
		</div>
	);
}
