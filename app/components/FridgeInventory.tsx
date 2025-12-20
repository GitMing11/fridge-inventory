// components/FridgeInventory.tsx
'use client';

import React, { useEffect, useState } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';

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
}

export default function FridgeInventory() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [showModal, setShowModal] = useState(false);
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

	return (
		<div
			style={{
				maxWidth: 700, // 조금 더 넓게
				margin: '1rem auto',
				padding: '2rem',
				backgroundColor: '#f9f9f9',
				borderRadius: '16px', // 둥글게 (통일)
				border: '1px solid #eee',
				boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // 부드러운 그림자 (통일)
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
					onClick={() => setShowModal(true)}
					style={{
						padding: '0.7rem 1.2rem',
						backgroundColor: '#333',
						color: '#fff',
						border: 'none',
						borderRadius: '10px', // 버튼도 둥글게
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
			/>

			{showModal && (
				<IngredientForm
					categories={categories}
					setCategories={setCategories}
					onAdd={(newItem) => setIngredients([...ingredients, newItem])}
					onClose={() => setShowModal(false)}
				/>
			)}
		</div>
	);
}
