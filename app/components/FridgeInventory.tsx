// app/components/FridgeInventory.tsx
'use client';

import React, { useEffect, useState } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import IngredientDetailModal from './IngredientDetailModal'; // 새로 추가
import { Category, Ingredient } from '../../types';
import ConsumeModal from './ConsumeModal';

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

	// 소비/폐기 처리를 위한 상태 추가
	const [consumingTarget, setConsumingTarget] = useState<{
		item: Ingredient;
		status: 'eaten' | 'discarded';
	} | null>(null);

	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then(setCategories);
		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	// [수정됨] 1. 버튼 클릭 시 모달 열기
	const handleConsumeClick = (id: number, status: 'eaten' | 'discarded') => {
		const target = ingredients.find((i) => i.id === id);
		if (target) {
			setConsumingTarget({ item: target, status });
		}
	};

	// [추가됨] 2. 모달에서 수량 입력 후 '확인' 시 API 호출
	const handleConfirmConsume = async (quantity: number) => {
		if (!consumingTarget) return;

		const { item, status } = consumingTarget;

		const res = await fetch(`/api/ingredients/${item.id}/consume`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status, quantity }), // 수량도 함께 전송
		});

		if (res.ok) {
			// 성공 시 목록 갱신 로직
			if (quantity >= item.quantity) {
				// 전체 소비: 목록에서 제거
				setIngredients((prev) => prev.filter((i) => i.id !== item.id));
			} else {
				// 부분 소비: 수량 업데이트
				setIngredients((prev) =>
					prev.map((i) =>
						i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i
					)
				);
			}
			setConsumingTarget(null); // 모달 닫기
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
				onConsume={handleConsumeClick}
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

			{/* [추가됨] 소비/폐기 수량 입력 모달 */}
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
