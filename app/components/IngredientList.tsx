'use client';

import React from 'react';
import { Ingredient } from '../../types';

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
			return <span className="ml-1 text-xs text-gray-300">⇅</span>;
		return (
			<span className="ml-1 text-xs text-gray-800">
				{sortOrder === 'asc' ? '▲' : '▼'}
			</span>
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
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			<table className="w-full border-collapse text-sm text-gray-800">
				<thead>
					<tr className="bg-gray-100/80">
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
								className={`select-none border-b border-gray-200 p-4 font-semibold text-gray-600 ${
									key ? 'cursor-pointer hover:bg-gray-200/50' : 'cursor-default'
								} text-center transition-colors`}
							>
								{label}
								{key && getSortIcon(key as Props['sortKey'])}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{sorted.map((i) => {
						const dDay = getDDay(i.expiration);
						const isExpired = dDay < 0;
						const isUrgent = dDay >= 0 && dDay <= 3;

						return (
							<tr
								key={i.id}
								className={`border-b border-gray-100 last:border-none transition-colors ${
									isExpired ? 'bg-red-50/60' : 'hover:bg-gray-50'
								}`}
							>
								{/* 1. 카테고리 */}
								<td className="px-2 py-4 text-center font-medium text-gray-500">
									{i.category?.name}
								</td>

								{/* 2. 이름 */}
								<td className="px-2 py-4 text-center">
									<span
										className="cursor-pointer font-bold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
										onClick={() => onView(i)}
									>
										{i.name}
									</span>
								</td>

								{/* 3. 수량 */}
								<td className="px-2 py-4 text-center font-medium">
									{i.quantity}
									<span className="ml-0.5 text-xs text-gray-400">{i.unit}</span>
								</td>

								{/* 4. 유통기한 */}
								<td className="px-2 py-4 text-center">
									<div
										className={`flex items-center justify-center gap-1.5 ${
											isExpired || isUrgent
												? 'font-bold text-red-700'
												: 'text-gray-800'
										}`}
									>
										{new Date(i.expiration).toLocaleDateString()}

										{/* 임박 배지 */}
										{isUrgent && (
											<span className="whitespace-nowrap rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
												D-{dDay === 0 ? 'Day' : dDay}
											</span>
										)}

										{/* 만료 배지 */}
										{isExpired && (
											<span className="whitespace-nowrap rounded bg-red-700 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
												만료
											</span>
										)}
									</div>
								</td>

								{/* 5. 구매일 */}
								<td className="px-2 py-4 text-center text-gray-500">
									{new Date(i.purchasedAt).toLocaleDateString()}
								</td>

								{/* 6. 관리 버튼들 */}
								<td className="px-2 py-4 text-center">
									<div className="flex items-center justify-center gap-1.5">
										<ActionButton
											onClick={() => onView(i)}
											className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
										>
											상세
										</ActionButton>

										<ActionButton
											onClick={() => onEdit(i)}
											className="bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
										>
											수정
										</ActionButton>

										{/* 구분선 */}
										<div className="mx-1 h-3 w-px bg-gray-300" />

										<ActionButton
											onClick={() => onConsume(i.id, 'eaten')}
											className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
										>
											완료
										</ActionButton>

										<ActionButton
											onClick={() => onConsume(i.id, 'discarded')}
											className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
										>
											폐기
										</ActionButton>
									</div>
								</td>
							</tr>
						);
					})}
					{ingredients.length === 0 && (
						<tr>
							<td
								colSpan={6}
								className="py-12 text-center text-gray-400"
							>
								등록된 재료가 없습니다.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

// 버튼 컴포넌트 분리
function ActionButton({
	onClick,
	className,
	children,
}: {
	onClick: () => void;
	className: string;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${className}`}
		>
			{children}
		</button>
	);
}
