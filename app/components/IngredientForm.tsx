'use client';

import React, { useState, useEffect } from 'react';
import { Category, Ingredient } from '../../types';
import {
	X,
	Plus,
	Calendar,
	Package,
	Tag,
	ShoppingBag,
	ChevronDown,
} from 'lucide-react';

interface Props {
	categories: Category[];
	setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	onAdd: (newItem: Ingredient) => void;
	onUpdate?: (updatedItem: Ingredient) => void;
	initialData?: Ingredient | null;
	onClose: () => void;
}

function getToday(): string {
	const today = new Date();
	return today.toISOString().split('T')[0];
}

function formatDateInput(dateStr: string): string {
	if (!dateStr) return getToday();
	return new Date(dateStr).toISOString().split('T')[0];
}

export default function IngredientForm({
	categories,
	setCategories,
	onAdd,
	onUpdate,
	initialData,
	onClose,
}: Props) {
	const [newIngredient, setNewIngredient] = useState({
		name: '',
		categoryId: 0,
		quantity: 0,
		unit: '',
		expiration: getToday(),
		purchasedAt: getToday(),
	});

	const [newCategory, setNewCategory] = useState('');
	const isEditMode = !!initialData;

	useEffect(() => {
		if (initialData) {
			setNewIngredient({
				name: initialData.name,
				categoryId: initialData.categoryId,
				quantity: initialData.quantity,
				unit: initialData.unit,
				expiration: formatDateInput(initialData.expiration),
				purchasedAt: formatDateInput(initialData.purchasedAt),
			});
		}
	}, [initialData]);

	const handleAddCategory = async () => {
		if (!newCategory.trim()) return;

		const res = await fetch('/api/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: newCategory.trim() }),
		});

		if (res.ok) {
			const created = await res.json();
			setCategories((prev) => [...prev, created]);
			setNewIngredient((prev) => ({ ...prev, categoryId: created.id }));
			setNewCategory('');
		} else {
			alert('카테고리 추가 실패');
		}
	};

	const handleSubmit = async () => {
		const { name, categoryId, quantity, unit, expiration, purchasedAt } =
			newIngredient;

		if (!name || !categoryId || !unit || !expiration || !purchasedAt) {
			alert('모든 필드를 채워주세요.');
			return;
		}

		try {
			if (initialData && onUpdate) {
				const res = await fetch(`/api/ingredients/${initialData.id}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newIngredient),
				});

				if (res.ok) {
					const updated = await res.json();
					onUpdate(updated);
					onClose();
				} else {
					alert('수정 실패');
				}
			} else {
				const res = await fetch('/api/ingredients', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newIngredient),
				});

				if (res.ok) {
					const added = await res.json();
					onAdd(added);
					onClose();
				} else {
					alert('추가 실패');
				}
			}
		} catch (e) {
			console.error(e);
			alert('오류가 발생했습니다.');
		}
	};

	const inputClassName =
		'w-full rounded-2xl border border-input-border bg-input-bg px-4 py-3.5 text-sm font-medium text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary/50';

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-sm transition-opacity p-4"
		>
			{/* 모달 박스 */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-full max-w-[500px] overflow-hidden rounded-3xl bg-card border border-card-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between border-b border-card-border px-8 py-6 bg-card/50 backdrop-blur-md">
					<div>
						<h2 className="text-xl font-bold text-foreground">
							{isEditMode ? '재료 수정하기' : '새로운 재료 추가'}
						</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							냉장고에 보관할 재료의 정보를 입력해주세요.
						</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-input-bg hover:text-foreground"
					>
						<X size={20} />
					</button>
				</div>

				{/* 폼 영역 */}
				<div className="flex flex-col gap-6 p-8">
					{/* 1. 카테고리 섹션 */}
					<div className="space-y-3">
						<Label
							icon={<Tag size={16} />}
							text="카테고리"
						/>
						<div className="flex flex-col gap-3 sm:flex-row">
							<div className="relative flex-1">
								<select
									value={newIngredient.categoryId}
									onChange={(e) =>
										setNewIngredient({
											...newIngredient,
											categoryId: Number(e.target.value),
										})
									}
									className={`${inputClassName} appearance-none cursor-pointer`}
								>
									<option value={0}>카테고리 선택</option>
									{categories.map((c) => (
										<option
											key={c.id}
											value={c.id}
										>
											{c.name}
										</option>
									))}
								</select>
								{/* Select 화살표 */}
								<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
									<ChevronDown className="h-3 w-3" />
								</div>
							</div>

							{/* 새 카테고리 추가 */}
							<div className="flex flex-1 gap-2">
								<input
									type="text"
									placeholder="새 카테고리"
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
									className={`${inputClassName} min-w-0`}
								/>
								<button
									onClick={handleAddCategory}
									disabled={!newCategory.trim()}
									className="flex w-12 items-center justify-center rounded-2xl bg-input-bg border border-input-border text-muted-foreground transition-colors hover:bg-card-border hover:text-foreground disabled:opacity-50"
								>
									<Plus size={20} />
								</button>
							</div>
						</div>
					</div>

					{/* 2. 이름 */}
					<div className="space-y-3">
						<Label
							icon={<Package size={16} />}
							text="재료 이름"
						/>
						<input
							type="text"
							placeholder="예: 양파, 우유, 삼겹살"
							value={newIngredient.name}
							onChange={(e) =>
								setNewIngredient({ ...newIngredient, name: e.target.value })
							}
							className={inputClassName}
						/>
					</div>

					{/* 3. 수량 및 단위 (가로 배치) */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-3">
							<Label
								icon={<ShoppingBag size={16} />}
								text="수량"
							/>
							<input
								type="number"
								placeholder="0"
								value={newIngredient.quantity || ''}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										quantity: Number(e.target.value),
									})
								}
								className={inputClassName}
							/>
						</div>
						<div className="space-y-3">
							<Label text="단위" />
							<input
								type="text"
								placeholder="개, g, ml"
								value={newIngredient.unit}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, unit: e.target.value })
								}
								className={inputClassName}
							/>
						</div>
					</div>

					{/* 4. 날짜 정보 (가로 배치) */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-3">
							<Label
								icon={<Calendar size={16} />}
								text="유통기한"
							/>
							<input
								type="date"
								value={newIngredient.expiration}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										expiration: e.target.value,
									})
								}
								className={`${inputClassName} cursor-pointer`}
							/>
						</div>
						<div className="space-y-3">
							<Label text="구매일" />
							<input
								type="date"
								value={newIngredient.purchasedAt}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										purchasedAt: e.target.value,
									})
								}
								className={`${inputClassName} cursor-pointer`}
							/>
						</div>
					</div>

					{/* 완료 버튼 */}
					<button
						onClick={handleSubmit}
						className="mt-4 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98]"
					>
						{isEditMode ? '변경사항 저장하기' : '냉장고에 채우기'}
					</button>
				</div>
			</div>
		</div>
	);
}

// 라벨 컴포넌트
function Label({ icon, text }: { icon?: React.ReactNode; text: string }) {
	return (
		<label className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
			{icon}
			{text}
		</label>
	);
}
