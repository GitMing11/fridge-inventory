'use client';

import React, { useEffect, useState } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import IngredientDetailModal from './IngredientDetailModal';
import { Category, Ingredient } from '../../types';
import ConsumeModal from './ConsumeModal';

export default function FridgeInventory() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [showModal, setShowModal] = useState(false);

	const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
	const [viewingItem, setViewingItem] = useState<Ingredient | null>(null);

	const [sortKey, setSortKey] = useState<
		'expiration' | 'purchasedAt' | 'category' | 'name'
	>('expiration');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const [consumingTarget, setConsumingTarget] = useState<{
		item: Ingredient;
		status: 'eaten' | 'discarded';
	} | null>(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(
		'all'
	);

	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then(setCategories);
		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	const handleConsumeClick = (id: number, status: 'eaten' | 'discarded') => {
		const target = ingredients.find((i) => i.id === id);
		if (target) {
			setConsumingTarget({ item: target, status });
		}
	};

	const handleConfirmConsume = async (quantity: number) => {
		if (!consumingTarget) return;

		const { item, status } = consumingTarget;

		const res = await fetch(`/api/ingredients/${item.id}/consume`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status, quantity }),
		});

		if (res.ok) {
			if (quantity >= item.quantity) {
				setIngredients((prev) => prev.filter((i) => i.id !== item.id));
			} else {
				setIngredients((prev) =>
					prev.map((i) =>
						i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i
					)
				);
			}
			setConsumingTarget(null);
		} else {
			alert('처리 실패');
		}
	};

	const handleEditClick = (item: Ingredient) => {
		setEditingItem(item);
		setShowModal(true);
	};

	const handleViewClick = (item: Ingredient) => {
		setViewingItem(item);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingItem(null);
	};

	const handleUpdateComplete = (updatedItem: Ingredient) => {
		setIngredients((prev) =>
			prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
		);
	};

	const filteredIngredients = ingredients.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || item.categoryId === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="mx-auto my-8 max-w-5xl rounded-3xl bg-white p-10 font-sans text-gray-800 shadow-xl border border-gray-100">
			<h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
				냉장고 재고 관리
			</h1>

			{/* --- 검색 및 필터 영역 --- */}
			<div className="mb-8 flex flex-wrap items-center gap-3">
				{/* 검색창 */}
				<div className="relative flex-1 min-w-[240px]">
					<svg
						className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle
							cx="11"
							cy="11"
							r="8"
						></circle>
						<line
							x1="21"
							y1="21"
							x2="16.65"
							y2="16.65"
						></line>
					</svg>
					<input
						type="text"
						placeholder="재료 이름 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="h-[46px] w-full rounded-xl border border-gray-200 bg-gray-50 pl-[42px] pr-3 text-base text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-gray-800 focus:bg-white focus:ring-4 focus:ring-gray-100"
					/>
				</div>

				{/* 카테고리 선택 */}
				<div className="relative min-w-[160px]">
					<select
						value={selectedCategory}
						onChange={(e) =>
							setSelectedCategory(
								e.target.value === 'all' ? 'all' : Number(e.target.value)
							)
						}
						className="h-[46px] w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-base font-medium text-gray-700 outline-none transition-colors focus:border-gray-800"
					>
						<option value="all">전체 카테고리</option>
						{categories.map((cat) => (
							<option
								key={cat.id}
								value={cat.id}
							>
								{cat.name}
							</option>
						))}
					</select>
					{/* 화살표 아이콘 */}
					<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</div>
				</div>
			</div>

			{/* 버튼 영역 */}
			<div className="mb-6 flex justify-end">
				<button
					onClick={() => {
						setEditingItem(null);
						setShowModal(true);
					}}
					className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
				>
					<span className="text-lg leading-none">+</span> 재료 추가
				</button>
			</div>

			<IngredientList
				ingredients={filteredIngredients}
				sortKey={sortKey}
				sortOrder={sortOrder}
				onSortKeyChange={setSortKey}
				onSortOrderChange={setSortOrder}
				onConsume={handleConsumeClick}
				onEdit={handleEditClick}
				onView={handleViewClick}
			/>

			{/* 모달들 */}
			{showModal && (
				<IngredientForm
					categories={categories}
					setCategories={setCategories}
					onAdd={(newItem) => setIngredients([...ingredients, newItem])}
					onUpdate={handleUpdateComplete}
					initialData={editingItem}
					onClose={handleCloseModal}
				/>
			)}

			{viewingItem && (
				<IngredientDetailModal
					item={viewingItem}
					onClose={() => setViewingItem(null)}
				/>
			)}

			{consumingTarget && (
				<ConsumeModal
					item={consumingTarget.item}
					status={consumingTarget.status}
					onConfirm={handleConfirmConsume}
					onClose={() => setConsumingTarget(null)}
				/>
			)}
		</div>
	);
}
