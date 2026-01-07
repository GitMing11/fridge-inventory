'use client';

import React, { useState, useEffect } from 'react';
import { Category, Ingredient } from '../../types';

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

// 날짜 문자열(ISO)을 YYYY-MM-DD로 변환
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

	// 수정 모드일 경우 초기 데이터 세팅
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
				// --- 수정 모드 (PATCH) ---
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
				// --- 추가 모드 (POST) ---
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

	// 공통 입력창 클래스
	const inputClassName =
		'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
		>
			{/* 모달 박스 */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-[90%] max-w-[500px] overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
			>
				{/* 헤더 */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900">
						{isEditMode ? '재료 수정' : '재료 추가'}
					</h2>
					<button
						onClick={onClose}
						className="text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600"
					>
						&times;
					</button>
				</div>

				{/* 폼 영역 */}
				<div className="flex flex-col gap-4">
					{/* 카테고리 */}
					<div className="flex items-center gap-4">
						<label className="w-[70px] shrink-0 text-sm font-semibold text-gray-600">
							카테고리
						</label>
						<div className="flex flex-1 gap-2">
							<select
								value={newIngredient.categoryId}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										categoryId: Number(e.target.value),
									})
								}
								className={`${inputClassName} flex-[0_0_35%] cursor-pointer appearance-none`}
							>
								<option value={0}>선택</option>
								{categories.map((c) => (
									<option
										key={c.id}
										value={c.id}
									>
										{c.name}
									</option>
								))}
							</select>

							<input
								type="text"
								placeholder="새 카테고리"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								className={`${inputClassName} flex-1`}
							/>

							<button
								onClick={handleAddCategory}
								className="whitespace-nowrap rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
							>
								추가
							</button>
						</div>
					</div>

					{/* 이름 */}
					<FormRow label="이름">
						<input
							type="text"
							placeholder="예: 상추"
							value={newIngredient.name}
							onChange={(e) =>
								setNewIngredient({ ...newIngredient, name: e.target.value })
							}
							className={inputClassName}
						/>
					</FormRow>

					{/* 수량 */}
					<FormRow label="수량">
						<input
							type="number"
							placeholder="예: 2"
							value={newIngredient.quantity || ''}
							onChange={(e) =>
								setNewIngredient({
									...newIngredient,
									quantity: Number(e.target.value),
								})
							}
							className={inputClassName}
						/>
					</FormRow>

					{/* 단위 */}
					<FormRow label="단위">
						<input
							type="text"
							placeholder="예: 개, g, ml"
							value={newIngredient.unit}
							onChange={(e) =>
								setNewIngredient({ ...newIngredient, unit: e.target.value })
							}
							className={inputClassName}
						/>
					</FormRow>

					{/* 유통기한 */}
					<FormRow label="유통기한">
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
					</FormRow>

					{/* 구매일 */}
					<FormRow label="구매일">
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
					</FormRow>

					{/* 완료 버튼 */}
					<button
						onClick={handleSubmit}
						className={`mt-6 w-full rounded-xl py-3.5 text-base font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98] ${
							isEditMode
								? 'bg-blue-600 hover:bg-blue-700'
								: 'bg-gray-900 hover:bg-gray-800'
						}`}
					>
						{isEditMode ? '수정 완료' : '추가하기'}
					</button>
				</div>
			</div>
		</div>
	);
}

function FormRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-4">
			<label className="w-[70px] shrink-0 text-sm font-semibold text-gray-600">
				{label}
			</label>
			<div className="flex-1">{children}</div>
		</div>
	);
}
