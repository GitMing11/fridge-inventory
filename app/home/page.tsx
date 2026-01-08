'use client';

import React, { useEffect, useState } from 'react';
import {
	Refrigerator,
	AlertTriangle,
	XCircle,
	Plus,
	Search,
	Filter,
} from 'lucide-react';

import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import IngredientDetailModal from '../components/IngredientDetailModal';
import { Category, Ingredient } from '../../types';
import ConsumeModal from '../components/ConsumeModal';

// [Helper] 날짜 차이 계산
const getDDay = (expiration: string) => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const [y, m, d] = expiration.split('-').map(Number);
	const exp = new Date(y, m - 1, d);
	const diffMs = exp.getTime() - today.getTime();
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export default function HomePage() {
	// --- State ---
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [greeting, setGreeting] = useState('');

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

	// --- Effects ---
	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then(setCategories);
		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	// --- Stats Calculation ---
	const totalCount = ingredients.length;
	const expiringCount = ingredients.filter((i) => {
		const dDay = getDDay(i.expiration);
		return dDay >= 0 && dDay <= 3;
	}).length;
	const expiredCount = ingredients.filter(
		(i) => getDDay(i.expiration) < 0
	).length;

	// --- Handlers ---
	const handleConsumeClick = (id: number, status: 'eaten' | 'discarded') => {
		const target = ingredients.find((i) => i.id === id);
		if (target) setConsumingTarget({ item: target, status });
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

	const filteredIngredients = ingredients.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || item.categoryId === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const handleUpdateComplete = (updatedItem: Ingredient) => {
		setIngredients((prev) =>
			prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
		);
	};

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12 max-w-6xl mx-auto w-full space-y-10">
				{/* 1. Header Section */}
				<section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
							{greeting}
						</h2>
						<p className="text-muted-foreground text-lg">
							냉장고 속 재료를 스마트하게 관리해보세요.
						</p>
					</div>
					<button
						onClick={() => {
							setEditingItem(null);
							setShowModal(true);
						}}
						// [수정] btn-add 색상 변수 사용
						className="group flex items-center justify-center gap-2 rounded-2xl bg-btn-add text-btn-add-foreground px-6 py-3.5 text-base font-bold shadow-lg shadow-btn-add/25 transition-all hover:bg-btn-add-hover hover:-translate-y-0.5 active:scale-95"
					>
						<Plus
							className="w-5 h-5"
							strokeWidth={3}
						/>
						재료 추가하기
					</button>
				</section>

				{/* 2. Stats Section */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<StatCard
						title="보관 중인 재료"
						count={totalCount}
						icon={<Refrigerator className="w-7 h-7" />}
						theme="sky"
					/>
					<StatCard
						title="유통기한 임박"
						count={expiringCount}
						icon={<AlertTriangle className="w-7 h-7" />}
						theme="amber"
					/>
					<StatCard
						title="만료된 재료"
						count={expiredCount}
						icon={<XCircle className="w-7 h-7" />}
						theme="rose"
					/>
				</section>

				{/* 3. Controls & List Section */}
				<section className="space-y-6">
					{/* Floating Search & Filter Bar */}
					<div className="flex flex-col md:flex-row gap-4">
						{/* 검색창 */}
						<div className="relative grow">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="text"
								placeholder="재료 이름 검색..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full h-12 rounded-2xl border border-card-border bg-card px-12 text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 hover:shadow-md outline-none"
							/>
						</div>

						{/* 필터 */}
						<div className="relative min-w-[180px]">
							<Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
							<select
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(
										e.target.value === 'all' ? 'all' : Number(e.target.value)
									)
								}
								className="w-full h-12 appearance-none rounded-2xl border border-card-border bg-card pl-11 pr-10 text-foreground shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 hover:shadow-md cursor-pointer outline-none"
							>
								<option value="all">전체보기</option>
								{categories.map((cat) => (
									<option
										key={cat.id}
										value={cat.id}
									>
										{cat.name}
									</option>
								))}
							</select>
							{/* Custom Chevron */}
							<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</div>
						</div>
					</div>

					{/* 리스트 컴포넌트 */}
					<IngredientList
						ingredients={filteredIngredients}
						sortKey={sortKey}
						sortOrder={sortOrder}
						onSortKeyChange={setSortKey}
						onSortOrderChange={setSortOrder}
						onConsume={handleConsumeClick}
						onEdit={(item) => {
							setEditingItem(item);
							setShowModal(true);
						}}
						onView={setViewingItem}
					/>
				</section>
			</main>

			{/* --- Modals --- */}
			{showModal && (
				<IngredientForm
					categories={categories}
					setCategories={setCategories}
					onAdd={(newItem) => setIngredients([...ingredients, newItem])}
					onUpdate={handleUpdateComplete}
					initialData={editingItem}
					onClose={() => {
						setShowModal(false);
						setEditingItem(null);
					}}
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

// 통계 카드 컴포넌트
function StatCard({
	title,
	count,
	icon,
	theme,
}: {
	title: string;
	count: number;
	icon: React.ReactNode;
	theme: 'sky' | 'amber' | 'rose';
}) {
	// 테마별 색상 매핑
	const themeStyles = {
		sky: {
			text: 'text-foreground',
			iconBg: 'bg-sky-100/50 dark:bg-sky-900/20',
			iconColor: 'text-sky-600 dark:text-sky-400',
		},
		amber: {
			text: 'text-amber-600 dark:text-amber-400',
			iconBg: 'bg-amber-100/50 dark:bg-amber-900/20',
			iconColor: 'text-amber-600 dark:text-amber-400',
		},
		rose: {
			text: 'text-rose-600 dark:text-rose-400',
			iconBg: 'bg-rose-100/50 dark:bg-rose-900/20',
			iconColor: 'text-rose-600 dark:text-rose-400',
		},
	};

	const style = themeStyles[theme];

	return (
		<div className="group bg-card border border-card-border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
			<div>
				<p className="text-muted-foreground font-medium mb-1">{title}</p>
				<p className={`text-4xl font-bold ${style.text}`}>
					{count}
					<span className="text-lg font-medium text-muted-foreground ml-1">
						개
					</span>
				</p>
			</div>
			<div
				className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${style.iconBg} ${style.iconColor}`}
			>
				{icon}
			</div>
		</div>
	);
}
