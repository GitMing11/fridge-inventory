'use client';

import React, { useEffect, useState } from 'react';
import {
	Refrigerator,
	AlertTriangle,
	XCircle,
	Plus,
	Search,
	Filter,
	ChevronDown,
} from 'lucide-react';

import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import IngredientDetailModal from '../components/IngredientDetailModal';
import { Category, Ingredient } from '../../types';
import ConsumeModal from '../components/ConsumeModal';
import toast from 'react-hot-toast';

// [Helper] 날짜 차이 계산
const getDDay = (expiration: string) => {
	if (!expiration) return 0;

	// '2025-08-17T00:00...' 형태일 경우 'T' 앞부분만 사용
	const datePart = expiration.includes('T')
		? expiration.split('T')[0]
		: expiration;

	const now = new Date();
	// 오늘 날짜의 0시 0분 0초 (시간 영향 제거)
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const [y, m, d] = datePart.split('-').map(Number);
	// 만료일의 0시 0분 0초
	const exp = new Date(y, m - 1, d);

	const diffMs = exp.getTime() - today.getTime();
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export default function HomePage() {
	// --- State ---
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
			toast.error('처리 실패');
		}
	};

	const handleBulkConsume = async (
		ids: number[],
		status: 'eaten' | 'discarded'
	) => {
		try {
			const res = await fetch('/api/ingredients/bulk-consume', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids, status }),
			});

			if (res.ok) {
				// 선택된 재료들을 목록에서 제거 (일괄 처리는 전량 소모로 가정)
				setIngredients((prev) => prev.filter((i) => !ids.includes(i.id)));

				const actionText = status === 'eaten' ? '소비' : '폐기';
				toast.success(`${ids.length}개의 재료가 ${actionText}되었습니다.`);
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || '일괄 처리에 실패했습니다.');
			}
		} catch (e) {
			console.error(e);
			toast.error('서버 통신 오류가 발생했습니다.');
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
		<div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12 max-w-5xl mx-auto w-full space-y-10">
				{/* 1. Header Section */}
				<section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
							냉장고 재고 관리
						</h2>
						<p className="text-muted-foreground text-lg">
							식재료를 효율적으로 관리해보세요.
						</p>
					</div>
					<button
						onClick={() => {
							setEditingItem(null);
							setShowModal(true);
						}}
						className="group flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-base font-bold shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95"
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
						theme="info"
					/>
					<StatCard
						title="유통기한 임박"
						count={expiringCount}
						icon={<AlertTriangle className="w-7 h-7" />}
						theme="warning"
					/>
					<StatCard
						title="만료된 재료"
						count={expiredCount}
						icon={<XCircle className="w-7 h-7" />}
						theme="danger"
					/>
				</section>

				{/* 3. Controls & List Section */}
				<section className="space-y-6">
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

							<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
								<ChevronDown className="h-3 w-3" />
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
						onBulkConsume={handleBulkConsume}
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
	theme: 'info' | 'warning' | 'danger';
}) {
	const themeStyles = {
		info: {
			text: 'text-info-foreground',
			iconBg: 'bg-info/50 dark:bg-info/20',
			iconColor: 'text-info-foreground',
		},
		warning: {
			text: 'text-warning-foreground',
			iconBg: 'bg-warning/50 dark:bg-warning/20',
			iconColor: 'text-warning-foreground',
		},
		danger: {
			text: 'text-danger-foreground',
			iconBg: 'bg-danger/50 dark:bg-danger/20',
			iconColor: 'text-danger-foreground',
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
