'use client';

import React, { useState } from 'react';
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
	CheckSquare,
	Square,
} from 'lucide-react';
import ActionButton from './ui/ActionButton';
import MobileIngredientCard from './ui/MobileIngredientCard';

interface Props {
	ingredients: Ingredient[];
	sortKey: 'expiration' | 'purchasedAt' | 'category' | 'name';
	sortOrder: 'asc' | 'desc';
	onSortKeyChange: (key: Props['sortKey']) => void;
	onSortOrderChange: (order: Props['sortOrder']) => void;
	onConsume: (id: number, status: 'eaten' | 'discarded') => void;
	onEdit: (item: Ingredient) => void;
	onView: (item: Ingredient) => void;
	onBulkConsume?: (
		ids: number[],
		status: 'eaten' | 'discarded'
	) => Promise<void>;
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
	onBulkConsume,
}: Props) {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

	// [핸들러] 전체 선택/해제
	const handleSelectAll = () => {
		if (selectedIds.length === sorted.length && sorted.length > 0) {
			setSelectedIds([]);
		} else {
			setSelectedIds(sorted.map((i) => i.id));
		}
	};

	// [핸들러] 개별 선택/해제
	const handleSelectOne = (id: number) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((sid) => sid !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	// [핸들러] 일괄 처리 실행
	const handleBulkAction = async (status: 'eaten' | 'discarded') => {
		if (!onBulkConsume) return;
		if (
			confirm(
				`${selectedIds.length}개 항목을 ${
					status === 'eaten' ? '소비' : '폐기'
				} 처리하시겠습니까?`
			)
		) {
			await onBulkConsume(selectedIds, status);
			setSelectedIds([]); // 처리 후 선택 초기화
		}
	};

	return (
		<div className="relative space-y-4">
			{selectedIds.length > 0 && (
				<div className="sticky top-4 z-10 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2">
					<div className="flex items-center gap-3">
						<div
							className="cursor-pointer text-primary"
							onClick={handleSelectAll}
						>
							<CheckSquare className="h-5 w-5" />
						</div>
						<span className="text-sm font-bold text-primary">
							{selectedIds.length}개 선택됨
						</span>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => handleBulkAction('eaten')}
							className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-bold text-success-foreground hover:bg-success/90"
						>
							<Check size={14} /> 일괄 소비
						</button>
						<button
							onClick={() => handleBulkAction('discarded')}
							className="flex items-center gap-1.5 rounded-lg bg-danger px-3 py-1.5 text-xs font-bold text-danger-foreground hover:bg-danger/90"
						>
							<Trash2 size={14} /> 일괄 폐기
						</button>
					</div>
				</div>
			)}

			{/* --- 모바일 전용 뷰 --- */}
			<div className="flex flex-col gap-4 sm:hidden">
				{/* 정렬 컨트롤 */}
				<div className="flex items-center justify-between">
					{/* 전체 선택 버튼 (모바일용) */}
					<button
						onClick={handleSelectAll}
						className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
					>
						{selectedIds.length === sorted.length && sorted.length > 0 ? (
							<CheckSquare className="h-4 w-4 text-primary" />
						) : (
							<Square className="h-4 w-4" />
						)}
						전체 선택
					</button>

					<div className="flex items-center gap-2">
						<select
							value={sortKey}
							onChange={(e) => onSortKeyChange(e.target.value as any)}
							className="rounded-lg border border-input-border bg-card px-2 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary"
						>
							<option value="expiration">유통기한순</option>
							<option value="purchasedAt">구매일순</option>
							<option value="name">이름순</option>
							<option value="category">카테고리순</option>
						</select>
						<button
							onClick={() =>
								onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
							}
							className="rounded-lg border border-input-border bg-card p-1.5 text-muted-foreground hover:text-primary"
						>
							{sortOrder === 'asc' ? (
								<ArrowUp size={14} />
							) : (
								<ArrowDown size={14} />
							)}
						</button>
					</div>
				</div>

				{/* 카드 리스트 */}
				{sorted.length > 0 ? (
					sorted.map((i) => (
						<MobileIngredientCard
							key={i.id}
							ingredient={i}
							isSelected={selectedIds.includes(i.id)}
							onToggleSelect={handleSelectOne}
							onView={onView}
							onEdit={onEdit}
							onConsume={onConsume}
						/>
					))
				) : (
					<div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-card-border py-16 text-muted-foreground">
						<MoreHorizontal className="h-8 w-8 opacity-30" />
						<p className="text-sm font-medium">등록된 재료가 없습니다.</p>
					</div>
				)}
			</div>

			{/* --- PC 전용 뷰 --- */}
			<div className="hidden overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm sm:block">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="bg-muted/5 border-b border-card-border">
								{/* [추가] 전체 선택 체크박스 컬럼 */}
								<th className="px-4 py-5 text-center">
									<div
										className="flex cursor-pointer items-center justify-center"
										onClick={handleSelectAll}
									>
										{selectedIds.length === sorted.length &&
										sorted.length > 0 ? (
											<CheckSquare className="h-4 w-4 text-primary" />
										) : (
											<Square className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
										)}
									</div>
								</th>

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
								const isSelected = selectedIds.includes(i.id);

								return (
									<tr
										key={i.id}
										className={`group transition-all duration-200 ${
											isSelected
												? 'bg-primary/5'
												: isExpired
												? 'bg-danger/10 hover:bg-danger/15'
												: 'hover:bg-muted/5'
										}`}
										onClick={() => onView(i)} // 행 클릭 시 상세보기
									>
										{/* [추가] 개별 선택 체크박스 */}
										<td className="px-4 py-4 text-center">
											<div
												className="flex cursor-pointer items-center justify-center"
												onClick={(e) => {
													e.stopPropagation(); // 상세보기 모달 방지
													handleSelectOne(i.id);
												}}
											>
												{isSelected ? (
													<CheckSquare className="h-4 w-4 text-primary" />
												) : (
													<Square className="h-4 w-4 text-muted-foreground/30 hover:text-muted-foreground" />
												)}
											</div>
										</td>

										<td className="px-4 py-4 text-center">
											<span className="inline-flex items-center rounded-full bg-input-bg px-2.5 py-1 text-xs font-medium text-muted-foreground">
												{i.category?.name}
											</span>
										</td>

										<td className="px-4 py-4 text-center">
											<span className="cursor-pointer font-bold text-foreground transition-colors hover:text-primary hover:underline decoration-2 underline-offset-4">
												{i.name}
											</span>
										</td>

										<td className="px-4 py-4 text-center font-medium text-foreground">
											{i.quantity}
											<span className="ml-0.5 text-xs text-muted-foreground">
												{i.unit}
											</span>
										</td>

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
												{isUrgent && (
													<span className="whitespace-nowrap rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground ring-1 ring-inset ring-warning-foreground/10">
														D-{dDay === 0 ? 'Day' : dDay}
													</span>
												)}
												{isExpired && (
													<span className="whitespace-nowrap rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-bold text-danger-foreground ring-1 ring-inset ring-danger-foreground/10">
														만료
													</span>
												)}
											</div>
										</td>

										<td className="px-4 py-4 text-center text-muted-foreground">
											{new Date(i.purchasedAt).toLocaleDateString()}
										</td>

										<td className="px-4 py-4 text-center">
											<div className="flex items-center justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
												<ActionButton
													onClick={() => onView(i)}
													variant="info"
													title="상세보기"
												>
													<Eye size={14} />
												</ActionButton>
												<ActionButton
													onClick={() => onEdit(i)}
													variant="neutral"
													title="수정"
												>
													<Edit2 size={14} />
												</ActionButton>
												<div className="mx-1 h-4 w-px bg-card-border" />
												<ActionButton
													onClick={() => onConsume(i.id, 'eaten')}
													variant="success"
													title="소비 완료"
												>
													<Check size={14} />
												</ActionButton>
												<ActionButton
													onClick={() => onConsume(i.id, 'discarded')}
													variant="danger"
													title="폐기"
												>
													<Trash2 size={14} />
												</ActionButton>
											</div>
										</td>
									</tr>
								);
							})}

							{sorted.length === 0 && (
								<tr>
									<td
										colSpan={7} // 체크박스 포함 7칸
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
		</div>
	);
}
