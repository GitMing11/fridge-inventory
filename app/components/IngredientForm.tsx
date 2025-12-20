// components/IngredientForm.tsx
import React, { useState, useEffect } from 'react';

import { Category, Ingredient } from '../../types';

interface Props {
	categories: Category[];
	setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	onAdd: (newItem: Ingredient) => void;
	onUpdate?: (updatedItem: Ingredient) => void; // 수정 완료 시 호출
	initialData?: Ingredient | null; // 수정할 데이터 (없으면 추가 모드)
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

	// 공통 입력창 스타일
	const inputBaseStyle: React.CSSProperties = {
		padding: '0.6rem 0.8rem',
		fontSize: '0.95rem',
		border: '1px solid #ccc',
		borderRadius: '8px',
		backgroundColor: '#fff',
		color: '#333',
		outline: 'none',
		width: '100%',
		boxSizing: 'border-box',
		transition: 'border-color 0.2s',
	};

	const isEditMode = !!initialData;

	return (
		<div
			onClick={onClose}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0,0,0,0.5)',
				backdropFilter: 'blur(4px)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1000,
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					backgroundColor: '#fff',
					borderRadius: '16px',
					padding: '2rem',
					width: '90%',
					maxWidth: '500px',
					boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
					display: 'flex',
					flexDirection: 'column',
					gap: '1.2rem',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '0.5rem',
					}}
				>
					<h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
						{isEditMode ? '재료 수정' : '재료 추가'}
					</h2>
					<button
						onClick={onClose}
						style={{
							background: 'none',
							border: 'none',
							fontSize: '1.5rem',
							cursor: 'pointer',
							color: '#999',
						}}
					>
						&times;
					</button>
				</div>

				{/* 폼 영역 */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					{/* 카테고리 */}
					<div style={rowStyle}>
						<label style={labelStyle}>카테고리</label>
						<div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
							<select
								value={newIngredient.categoryId}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										categoryId: Number(e.target.value),
									})
								}
								style={{
									...inputBaseStyle,
									flex: '0 0 35%',
									cursor: 'pointer',
								}}
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
								style={{ ...inputBaseStyle, flex: 1 }}
							/>

							<button
								onClick={handleAddCategory}
								style={{
									padding: '0 1rem',
									backgroundColor: '#666',
									color: '#fff',
									border: 'none',
									borderRadius: '8px',
									fontWeight: 600,
									cursor: 'pointer',
									fontSize: '0.9rem',
									whiteSpace: 'nowrap',
								}}
							>
								추가
							</button>
						</div>
					</div>

					{/* 이름 */}
					<div style={rowStyle}>
						<label style={labelStyle}>이름</label>
						<div style={{ flex: 1 }}>
							<input
								type="text"
								placeholder="예: 상추"
								value={newIngredient.name}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, name: e.target.value })
								}
								style={inputBaseStyle}
							/>
						</div>
					</div>

					{/* 수량 */}
					<div style={rowStyle}>
						<label style={labelStyle}>수량</label>
						<div style={{ flex: 1 }}>
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
								style={inputBaseStyle}
							/>
						</div>
					</div>

					{/* 단위 */}
					<div style={rowStyle}>
						<label style={labelStyle}>단위</label>
						<div style={{ flex: 1 }}>
							<input
								type="text"
								placeholder="예: 개, g, ml"
								value={newIngredient.unit}
								onChange={(e) =>
									setNewIngredient({ ...newIngredient, unit: e.target.value })
								}
								style={inputBaseStyle}
							/>
						</div>
					</div>

					{/* 유통기한 */}
					<div style={rowStyle}>
						<label style={labelStyle}>유통기한</label>
						<div style={{ flex: 1 }}>
							<input
								type="date"
								value={newIngredient.expiration}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										expiration: e.target.value,
									})
								}
								style={inputBaseStyle}
							/>
						</div>
					</div>

					{/* 구매일 */}
					<div style={rowStyle}>
						<label style={labelStyle}>구매일</label>
						<div style={{ flex: 1 }}>
							<input
								type="date"
								value={newIngredient.purchasedAt}
								onChange={(e) =>
									setNewIngredient({
										...newIngredient,
										purchasedAt: e.target.value,
									})
								}
								style={inputBaseStyle}
							/>
						</div>
					</div>

					{/* 버튼 */}
					<button
						onClick={handleSubmit}
						style={{
							marginTop: '1.5rem',
							padding: '0.9rem',
							backgroundColor: isEditMode ? '#1e88e5' : '#333', // 수정 시 파란색 계열
							color: '#fff',
							fontSize: '1rem',
							fontWeight: 'bold',
							border: 'none',
							borderRadius: '10px',
							cursor: 'pointer',
							boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
							transition: 'transform 0.1s',
						}}
						onMouseDown={(e) =>
							(e.currentTarget.style.transform = 'scale(0.98)')
						}
						onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					>
						{isEditMode ? '수정 완료' : '추가하기'}
					</button>
				</div>
			</div>
		</div>
	);
}

// 레이아웃용 스타일
const rowStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: '1rem',
};

const labelStyle: React.CSSProperties = {
	width: '70px',
	fontWeight: 600,
	fontSize: '0.95rem',
	color: '#555',
	flexShrink: 0,
};
