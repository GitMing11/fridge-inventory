// app/components/FridgeInventory.tsx
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

	// 수정 중인 아이템과 상세 보기 중인 아이템 상태 관리
	const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
	const [viewingItem, setViewingItem] = useState<Ingredient | null>(null);

	const [sortKey, setSortKey] = useState<
		'expiration' | 'purchasedAt' | 'category' | 'name'
	>('expiration');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// 소비/폐기 처리를 위한 상태 추가
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

	// 필터링 로직
	const filteredIngredients = ingredients.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || item.categoryId === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div
			style={{
				maxWidth: 1000,
				margin: '2rem auto',
				padding: '2.5rem',
				backgroundColor: '#ffffff',
				borderRadius: '24px',
				border: '1px solid #f0f0f0',
				boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				color: '#333',
			}}
		>
			<h1
				style={{
					textAlign: 'center',
					fontSize: '2rem',
					marginBottom: '2.5rem',
					fontWeight: 700,
					color: '#1a1a1a',
					letterSpacing: '-0.5px',
				}}
			>
				냉장고 재고 관리
			</h1>

			{/* --- [디자인 수정됨] 검색 및 필터 영역 --- */}
			<div
				style={{
					display: 'flex',
					gap: '12px',
					marginBottom: '2rem',
					flexWrap: 'wrap',
					alignItems: 'center',
				}}
			>
				{/* 검색창 컨테이너 */}
				<div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
					{/* 돋보기 아이콘 (SVG) */}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#888"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{
							position: 'absolute',
							left: '14px',
							top: '50%',
							transform: 'translateY(-50%)',
							pointerEvents: 'none',
						}}
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
						style={{
							width: '100%',
							padding: '0 12px 0 42px', // 아이콘 공간 확보
							height: '46px',
							borderRadius: '12px',
							border: '1px solid #e0e0e0',
							backgroundColor: '#f9fafb',
							fontSize: '0.95rem',
							outline: 'none',
							transition: 'all 0.2s ease',
							color: '#333',
						}}
						onFocus={(e) => {
							e.target.style.backgroundColor = '#fff';
							e.target.style.borderColor = '#333';
							e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)';
						}}
						onBlur={(e) => {
							e.target.style.backgroundColor = '#f9fafb';
							e.target.style.borderColor = '#e0e0e0';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				{/* 카테고리 선택 */}
				<div style={{ position: 'relative', minWidth: '160px' }}>
					<select
						value={selectedCategory}
						onChange={(e) =>
							setSelectedCategory(
								e.target.value === 'all' ? 'all' : Number(e.target.value)
							)
						}
						style={{
							width: '100%',
							height: '46px',
							padding: '0 36px 0 16px',
							borderRadius: '12px',
							border: '1px solid #e0e0e0',
							backgroundColor: '#fff',
							fontSize: '0.95rem',
							fontWeight: 500,
							color: '#444',
							cursor: 'pointer',
							outline: 'none',
							appearance: 'none', // 기본 화살표 제거 후 커스텀 화살표 사용 추천 (여기선 심플하게 유지)
							backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right 10px center',
							backgroundSize: '18px',
						}}
						onFocus={(e) => (e.target.style.borderColor = '#333')}
						onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
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
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '1.5rem',
				}}
			>
				<button
					onClick={() => {
						setEditingItem(null);
						setShowModal(true);
					}}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						padding: '0.75rem 1.4rem',
						backgroundColor: '#111',
						color: '#fff',
						border: 'none',
						borderRadius: '12px',
						cursor: 'pointer',
						fontWeight: 600,
						fontSize: '0.95rem',
						boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
						transition: 'all 0.2s',
					}}
					onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
					onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor = '#333';
						e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = '#111';
						e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
					}}
				>
					<span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> 재료 추가
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

			{/* 소비/폐기 수량 입력 모달 */}
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
