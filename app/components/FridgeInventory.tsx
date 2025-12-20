// app/components/FridgeInventory.tsx
'use client';

import React, { useEffect, useState } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import IngredientDetailModal from './IngredientDetailModal'; // 새로 추가

interface Category {
	id: number;
	name: string;
}

interface Ingredient {
	id: number;
	name: string;
	categoryId: number;
	category?: Category;
	quantity: number;
	unit: string;
	expiration: string;
	purchasedAt: string;
	createdAt: string;
	updatedAt?: string; // 추가
}

export default function FridgeInventory() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [showModal, setShowModal] = useState(false);

	// 수정 중인 아이템과 상세 보기 중인 아이템 상태 관리
	const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
	const [viewingItem, setViewingItem] = useState<Ingredient | null>(null); // 추가

	const [sortKey, setSortKey] = useState<
		'expiration' | 'purchasedAt' | 'category' | 'name'
	>('expiration');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then(setCategories);
		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	const handleConsume = async (id: number, status: 'eaten' | 'discarded') => {
		const res = await fetch(`/api/ingredients/${id}/consume`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status }),
		});

		if (res.ok) {
			setIngredients((prev) => prev.filter((i) => i.id !== id));
		} else {
			alert('처리 실패');
		}
	};

	const handleEditClick = (item: Ingredient) => {
		setEditingItem(item);
		setShowModal(true);
	};

	// 상세 보기 클릭 핸들러
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

	return (
		<div
			style={{
				maxWidth: 1000,
				margin: '1rem auto',
				padding: '2rem',
				backgroundColor: '#f9f9f9',
				borderRadius: '16px',
				border: '1px solid #eee',
				boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
				fontFamily: 'Arial, sans-serif',
				color: '#333',
			}}
		>
			<h1
				style={{
					textAlign: 'center',
					fontSize: '1.75rem',
					marginBottom: '2rem',
					fontWeight: 600,
					color: '#222',
				}}
			>
				냉장고 재고 관리
			</h1>

			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '1rem',
				}}
			>
				<button
					onClick={() => {
						setEditingItem(null);
						setShowModal(true);
					}}
					style={{
						padding: '0.7rem 1.2rem',
						backgroundColor: '#333',
						color: '#fff',
						border: 'none',
						borderRadius: '10px',
						cursor: 'pointer',
						fontWeight: 600,
						fontSize: '0.95rem',
						boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
						transition: 'transform 0.1s, background-color 0.2s',
					}}
					onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
					onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#444')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#333')}
				>
					+ 재료 추가
				</button>
			</div>

			<IngredientList
				ingredients={ingredients}
				sortKey={sortKey}
				sortOrder={sortOrder}
				onSortKeyChange={setSortKey}
				onSortOrderChange={setSortOrder}
				onConsume={handleConsume}
				onEdit={handleEditClick}
				onView={handleViewClick} // 핸들러 전달
			/>

			{/* 추가/수정 모달 */}
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

			{/* 상세 정보 모달 */}
			{viewingItem && (
				<IngredientDetailModal
					item={viewingItem}
					onClose={() => setViewingItem(null)}
				/>
			)}
		</div>
	);
}
