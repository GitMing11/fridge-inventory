import React from 'react';
import { Ingredient } from '../../../types';
import {
	CheckSquare,
	Square,
	ShoppingBag,
	Calendar,
	Tag,
	Edit2,
	Check,
	Trash2,
} from 'lucide-react';
import ActionButton from './ActionButton';
import { CATEGORY_COLORS } from '../../constants';

interface MobileIngredientCardProps {
	ingredient: Ingredient;
	isSelected: boolean;
	onToggleSelect: (id: number) => void;
	onView: (item: Ingredient) => void;
	onEdit: (item: Ingredient) => void;
	onConsume: (id: number, status: 'eaten' | 'discarded') => void;
}

export default function MobileIngredientCard({
	ingredient: i,
	isSelected,
	onToggleSelect,
	onView,
	onEdit,
	onConsume,
}: MobileIngredientCardProps) {
	// 날짜 계산 로직 (유틸로 분리하면 더 좋음)
	const getDDay = (expiration: string) => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const [y, m, d] = expiration.split('-').map(Number);
		const exp = new Date(y, m - 1, d);
		return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	};

	const dDay = getDDay(i.expiration);
	const isExpired = dDay < 0;
	const isUrgent = dDay >= 0 && dDay <= 3;

	const colorKey = (i.category?.color ||
		'gray') as keyof typeof CATEGORY_COLORS;
	const colorClass = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS['gray'];

	return (
		<div
			className={`relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-all active:scale-[0.98] ${
				isSelected
					? 'border-primary ring-1 ring-primary bg-primary/5'
					: isExpired
						? 'border-danger/30 bg-danger/5'
						: 'border-card-border hover:border-primary/30'
			}`}
			onClick={() => onView(i)}
		>
			<div className="flex items-start justify-between">
				<div
					onClick={(e) => {
						e.stopPropagation();
						onToggleSelect(i.id);
					}}
					className="mr-3 p-1"
				>
					{isSelected ? (
						<CheckSquare className="h-5 w-5 text-primary" />
					) : (
						<Square className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
				<div className="flex flex-1 items-start justify-between">
					<span
						className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${colorClass}`}
					>
						{i.category?.name}
					</span>
					<div className="flex items-center gap-2">
						{isUrgent && (
							<span className="rounded-md bg-warning px-2 py-0.5 text-xs font-bold text-warning-foreground">
								D-{dDay === 0 ? 'Day' : dDay}
							</span>
						)}
						{isExpired && (
							<span className="rounded-md bg-danger px-2 py-0.5 text-xs font-bold text-danger-foreground">
								만료
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="pl-8">
				<div className="flex items-center justify-between">
					<h3
						className={`text-lg font-bold ${
							isExpired ? 'text-danger' : 'text-foreground'
						}`}
					>
						{i.name}
					</h3>
					<div className="flex items-center gap-1.5 text-foreground">
						<ShoppingBag
							size={16}
							className="text-muted-foreground"
						/>
						<span className="font-semibold">{i.quantity}</span>
						<span className="text-sm text-muted-foreground">{i.unit}</span>
					</div>
				</div>
				<div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
					<div className="flex items-center gap-2">
						<Calendar size={12} />
						<span>유통기한: {new Date(i.expiration).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-2 opacity-70">
						<Tag size={12} />
						<span>구매일: {new Date(i.purchasedAt).toLocaleDateString()}</span>
					</div>
				</div>
			</div>

			<div className="mt-2 flex items-center justify-end gap-2 border-t border-card-border pt-3">
				<ActionButton
					onClick={() => onEdit(i)}
					variant="neutral"
					title="수정"
				>
					<Edit2 size={16} />
				</ActionButton>
				<div className="mx-1 h-4 w-px bg-card-border" />
				<ActionButton
					onClick={() => onConsume(i.id, 'eaten')}
					variant="success"
					title="소비"
				>
					<Check size={16} />
				</ActionButton>
				<ActionButton
					onClick={() => onConsume(i.id, 'discarded')}
					variant="danger"
					title="폐기"
				>
					<Trash2 size={16} />
				</ActionButton>
			</div>
		</div>
	);
}
