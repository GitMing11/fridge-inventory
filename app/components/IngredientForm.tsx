import React, { useState } from 'react';

interface Category {
	id: number;
	name: string;
}

interface Ingredient {
	id: number;
	name: string;
	categoryId: number;
	quantity: number;
	unit: string;
	expiration: string;
	purchasedAt: string;
	createdAt: string;
}

interface Props {
	categories: Category[];
	setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	onAdd: (newItem: Ingredient) => void;
	onClose: () => void;
}

function getToday(): string {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

export default function IngredientForm({
	categories,
	setCategories,
	onAdd,
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
			setNewIngredient({ ...newIngredient, categoryId: created.id });
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
			alert('재료 추가 실패');
		}
	};

	// 공통 입력창 스타일 (동글동글하고 깔끔하게)
	const inputBaseStyle: React.CSSProperties = {
		padding: '0.6rem 0.8rem',
		fontSize: '0.95rem',
		border: '1px solid #ccc',
		borderRadius: '8px', // 더 둥글게
		backgroundColor: '#fff',
		color: '#333',
		outline: 'none',
		width: '100%',
		boxSizing: 'border-box',
		transition: 'border-color 0.2s',
	};

	return (
		<div
			onClick={onClose}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0,0,0,0.5)', // 배경 조금 더 진하게
				backdropFilter: 'blur(4px)', // 블러 효과 추가
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
					borderRadius: '16px', // 모달 모서리 둥글게
					padding: '2rem',
					width: '90%',
					maxWidth: '500px',
					boxShadow: '0 10px 25px rgba(0,0,0,0.2)', // 그림자 추가로 입체감
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
						재료 추가
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
					{/* 카테고리 (높이 맞춤) */}
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
									flex: '0 0 35%', // 비율 조정
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

					{/* 추가하기 버튼 */}
					<button
						onClick={handleSubmit}
						style={{
							marginTop: '1.5rem',
							padding: '0.9rem',
							backgroundColor: '#333', // FridgeInventory 버튼과 색상 통일
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
						추가하기
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
