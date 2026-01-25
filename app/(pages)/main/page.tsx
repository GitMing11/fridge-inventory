'use client';

import React, { useState } from 'react';
import { Refrigerator, AlertTriangle, XCircle } from 'lucide-react';

import IngredientForm from '../../components/IngredientForm';
import IngredientList from '../../components/IngredientList';
import IngredientDetailModal from '../../components/ui/IngredientDetailModal';
import ConsumeModal from '../../components/ConsumeModal';
import StatCard from '../../components/ui/StatCard';
import FilterBar from '../../components/ui/FilterBar';
import MainHeader from '../../components/ui/MainHeader';

import { useInventory } from '../../hooks/useInventory';
import { getDDay } from '../../utils/dateUtils';
import { Ingredient } from '../../../types';

export default function MainPage() {
	// --- Custom Hook ---
	const {
		categories,
		setCategories,
		ingredients,
		consumeIngredient,
		bulkConsumeIngredients,
		addIngredient,
		updateIngredient,
	} = useInventory();

	// --- UI State (Modal & Filter) ---
	const [showModal, setShowModal] = useState(false);
	const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
	const [viewingItem, setViewingItem] = useState<Ingredient | null>(null);
	const [consumingTarget, setConsumingTarget] = useState<{
		item: Ingredient;
		status: 'eaten' | 'discarded';
	} | null>(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(
		'all',
	);
	const [sortKey, setSortKey] = useState<
		'expiration' | 'purchasedAt' | 'category' | 'name'
	>('expiration');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// --- Stats Calculation ---
	const totalCount = ingredients.length;
	const expiringCount = ingredients.filter((i) => {
		const dDay = getDDay(i.expiration);
		return dDay >= 0 && dDay <= 3;
	}).length;
	const expiredCount = ingredients.filter(
		(i) => getDDay(i.expiration) < 0,
	).length;

	// --- Filtering ---
	const filteredIngredients = ingredients.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || item.categoryId === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	// --- Handlers ---
	const handleConfirmConsume = async (quantity: number) => {
		if (!consumingTarget) return;
		const success = await consumeIngredient(
			consumingTarget.item,
			consumingTarget.status,
			quantity,
		);
		if (success) setConsumingTarget(null);
	};

	return (
		<div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
			<main className="flex-1 px-4 py-8 md:px-8 md:py-12 max-w-5xl mx-auto w-full space-y-10">
				{/* 1. Header */}
				<MainHeader
					onAddClick={() => {
						setEditingItem(null);
						setShowModal(true);
					}}
				/>

				{/* 2. Stats */}
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

				{/* 3. Controls & List */}
				<section className="space-y-6">
					<FilterBar
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
						categories={categories}
					/>

					<IngredientList
						ingredients={filteredIngredients}
						sortKey={sortKey}
						sortOrder={sortOrder}
						onSortKeyChange={setSortKey}
						onSortOrderChange={setSortOrder}
						onConsume={(id, status) => {
							const target = ingredients.find((i) => i.id === id);
							if (target) setConsumingTarget({ item: target, status });
						}}
						onEdit={(item) => {
							setEditingItem(item);
							setShowModal(true);
						}}
						onView={setViewingItem}
						onBulkConsume={bulkConsumeIngredients}
					/>
				</section>
			</main>

			{/* --- Modals --- */}
			{showModal && (
				<IngredientForm
					isOpen={showModal}
					categories={categories}
					setCategories={setCategories}
					onAdd={addIngredient}
					onUpdate={updateIngredient}
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
