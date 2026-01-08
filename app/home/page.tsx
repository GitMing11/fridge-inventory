'use client';

import React, { useEffect, useState } from 'react';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import IngredientDetailModal from '../components/IngredientDetailModal';
import { Category, Ingredient } from '../../types';
import ConsumeModal from '../components/ConsumeModal';

export default function HomePage() {
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
		<div className="mx-auto my-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
			{/* --- 메인 카드 컨테이너 --- */}
			<div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
				{/* 헤더 영역 */}
				<div className="border-b border-card-border px-8 py-8">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
								냉장고 재고 관리
							</h1>
							<p className="mt-2 text-sm font-medium text-muted-foreground">
								현재 보관 중인 재료:
								<span className="ml-1 inline-flex items-center justify-center rounded-full bg-input-bg px-2.5 py-0.5 text-xs font-bold text-foreground ring-1 ring-inset ring-input-border">
									{ingredients.length}개
								</span>
							</p>
						</div>

						{/* 액션 버튼 (데스크탑에서는 우측 상단 배치) */}
						<button
							onClick={() => {
								setEditingItem(null);
								setShowModal(true);
							}}
							className="group hidden md:flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line
									x1="12"
									y1="5"
									x2="12"
									y2="19"
								></line>
								<line
									x1="5"
									y1="12"
									x2="19"
									y2="12"
								></line>
							</svg>
							재료 추가
						</button>
					</div>
				</div>

				{/* 컨트롤 바 (검색 + 필터 + 모바일용 버튼) */}
				<div className="bg-input-bg/30 px-8 py-6">
					<div className="flex flex-col gap-4 sm:flex-row">
						{/* 검색창 */}
						<div className="relative grow">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
								<svg
									className="h-5 w-5"
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
							</div>
							<input
								type="text"
								placeholder="재료 이름으로 검색..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="h-12 w-full rounded-xl border border-input-border bg-card pl-11 pr-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
							/>
						</div>

						{/* 카테고리 필터 */}
						<div className="relative min-w-[180px]">
							<select
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(
										e.target.value === 'all' ? 'all' : Number(e.target.value)
									)
								}
								className="h-12 w-full appearance-none rounded-xl border border-input-border bg-card pl-4 pr-10 text-sm font-medium text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
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
							<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<svg
									width="16"
									height="16"
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

						{/* 모바일용 재료 추가 버튼 (작은 화면에서만 보임) */}
						<button
							onClick={() => {
								setEditingItem(null);
								setShowModal(true);
							}}
							className="flex md:hidden h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm active:scale-95"
						>
							+ 재료 추가
						</button>
					</div>
				</div>

				{/* 리스트 영역 */}
				<div className="p-8">
					{/* 리스트 컴포넌트에 여백을 주어 답답하지 않게 함 */}
					<div className="min-h-[300px]">
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

						{/* 데이터가 없을 때 안내 메시지 (옵션) */}
						{ingredients.length === 0 && (
							<div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
								<p className="text-lg font-medium">냉장고가 비어있어요 ❄️</p>
								<p className="text-sm">새로운 재료를 추가해보세요!</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* --- 모달 영역 --- */}
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
