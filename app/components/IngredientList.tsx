'use client';

import React from 'react';
import { Ingredient } from '../../types';
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreHorizontal,
	Eye,
	Edit2,
	Check,
	Trash2,
} from 'lucide-react';

interface Props {
	ingredients: Ingredient[];
	sortKey: 'expiration' | 'purchasedAt' | 'category' | 'name';
	sortOrder: 'asc' | 'desc';
	onSortKeyChange: (key: Props['sortKey']) => void;
	onSortOrderChange: (order: Props['sortOrder']) => void;
	onConsume: (id: number, status: 'eaten' | 'discarded') => void;
	onEdit: (item: Ingredient) => void;
	onView: (item: Ingredient) => void;
}

export default function IngredientList({
	ingredients,
	sortKey,
	sortOrder,
	onSortKeyChange,
	onSortOrderChange,
	onConsume,
	onEdit,
	onView,
}: Props) {
	const handleSort = (key: typeof sortKey) => {
		if (sortKey === key) {
			onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			onSortKeyChange(key);
			onSortOrderChange('asc');
		}
	};

	const getSortIcon = (key: typeof sortKey) => {
		if (key !== sortKey)
			return (
				<ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/30" />
			);
		return sortOrder === 'asc' ? (
			<ArrowUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
		) : (
			<ArrowDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
		);
	};

	const getDDay = (expiration: string) => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const [y, m, d] = expiration.split('-').map(Number);
		const exp = new Date(y, m - 1, d);
		const diffMs = exp.getTime() - today.getTime();
		return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	};

	const sorted = [...ingredients].sort((a, b) => {
		let compare = 0;
		switch (sortKey) {
			case 'expiration':
				compare =
					new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
				break;
			case 'purchasedAt':
				compare =
					new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
				break;
			case 'category':
				compare = (a.category?.name || '').localeCompare(
					b.category?.name || ''
				);
				break;
			case 'name':
				compare = a.name.localeCompare(b.name);
				break;
		}
		return sortOrder === 'asc' ? compare : -compare;
	});

	return (
		<div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="bg-muted/5 border-b border-card-border">
							{[
								{ key: 'category', label: '카테고리' },
								{ key: 'name', label: '이름' },
								{ key: null, label: '수량' },
								{ key: 'expiration', label: '유통기한' },
								{ key: 'purchasedAt', label: '구매일' },
								{ key: null, label: '관리' },
							].map(({ key, label }) => (
								<th
									key={label}
									onClick={() => key && handleSort(key as Props['sortKey'])}
									className={`whitespace-nowrap px-4 py-5 font-semibold text-muted-foreground transition-colors ${
										key
											? 'cursor-pointer hover:text-foreground'
											: 'cursor-default'
									} text-center`}
								>
									<div className="flex items-center justify-center">
										{label}
										{key && getSortIcon(key as Props['sortKey'])}
									</div>
								</th>
							))}
						</tr>
					</thead>

					<tbody className="divide-y divide-card-border">
						{sorted.map((i) => {
							const dDay = getDDay(i.expiration);
							const isExpired = dDay < 0;
							const isUrgent = dDay >= 0 && dDay <= 3;

							return (
								<tr
									key={i.id}
									className={`group transition-all duration-200 ${
										isExpired
											? 'bg-danger/10 hover:bg-danger/15'
											: 'hover:bg-muted/5'
									}`}
								>
									{/* 1. 카테고리 */}
									<td className="px-4 py-4 text-center">
										<span className="inline-flex items-center rounded-full bg-input-bg px-2.5 py-1 text-xs font-medium text-muted-foreground">
											{i.category?.name}
										</span>
									</td>

									{/* 2. 이름 */}
									<td className="px-4 py-4 text-center">
										<span
											className="cursor-pointer font-bold text-foreground transition-colors hover:text-primary hover:underline decoration-2 underline-offset-4"
											onClick={() => onView(i)}
										>
											{i.name}
										</span>
									</td>

									{/* 3. 수량 */}
									<td className="px-4 py-4 text-center font-medium text-foreground">
										{i.quantity}
										<span className="ml-0.5 text-xs text-muted-foreground">
											{i.unit}
										</span>
									</td>

									{/* 4. 유통기한 */}
									<td className="px-4 py-4 text-center">
										<div className="flex items-center justify-center gap-2">
											<span
												className={`${
													isExpired
														? 'text-danger-foreground font-bold'
														: isUrgent
														? 'text-warning-foreground font-bold'
														: 'text-muted-foreground'
												}`}
											>
												{new Date(i.expiration).toLocaleDateString()}
											</span>

											{/* 임박 배지 */}
											{isUrgent && (
												<span className="whitespace-nowrap rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground ring-1 ring-inset ring-warning-foreground/10">
													D-{dDay === 0 ? 'Day' : dDay}
												</span>
											)}

											{/* 만료 배지 */}
											{isExpired && (
												<span className="whitespace-nowrap rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-bold text-danger-foreground ring-1 ring-inset ring-danger-foreground/10">
													만료
												</span>
											)}
										</div>
									</td>

									{/* 5. 구매일 */}
									<td className="px-4 py-4 text-center text-muted-foreground">
										{new Date(i.purchasedAt).toLocaleDateString()}
									</td>

									{/* 6. 관리 버튼들 */}
									<td className="px-4 py-4 text-center">
										<div className="flex items-center justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
											<ActionButton
												onClick={() => onView(i)}
												className="bg-info text-info-foreground hover:opacity-80"
												title="상세보기"
											>
												<Eye size={14} />
											</ActionButton>

											<ActionButton
												onClick={() => onEdit(i)}
												className="bg-muted/15 text-muted-foreground hover:bg-muted/25 hover:text-foreground"
												title="수정"
											>
												<Edit2 size={14} />
											</ActionButton>

											<div className="mx-1 h-4 w-px bg-card-border" />

											<ActionButton
												onClick={() => onConsume(i.id, 'eaten')}
												className="bg-success text-success-foreground hover:opacity-80"
												title="소비 완료"
											>
												<Check size={14} />
											</ActionButton>

											<ActionButton
												onClick={() => onConsume(i.id, 'discarded')}
												className="bg-danger text-danger-foreground hover:opacity-80"
												title="폐기"
											>
												<Trash2 size={14} />
											</ActionButton>
										</div>
									</td>
								</tr>
							);
						})}

						{/* Empty State */}
						{ingredients.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="py-24 text-center"
								>
									<div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
											<MoreHorizontal className="h-8 w-8 opacity-30" />
										</div>
										<p className="text-base font-medium">
											등록된 재료가 없습니다.
										</p>
										<p className="text-xs opacity-70">
											새로운 재료를 추가하여 냉장고를 채워보세요.
										</p>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// 버튼 컴포넌트
function ActionButton({
	onClick,
	className,
	children,
	title,
}: {
	onClick: () => void;
	className: string;
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			title={title}
			className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md ${className}`}
		>
			{children}
		</button>
	);
}
