// app/components/IngredientList.tsx
import React from 'react';

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
	updatedAt?: string;
}

interface Props {
	ingredients: Ingredient[];
	sortKey: 'expiration' | 'purchasedAt' | 'category' | 'name';
	sortOrder: 'asc' | 'desc';
	onSortKeyChange: (key: Props['sortKey']) => void;
	onSortOrderChange: (order: Props['sortOrder']) => void;
	onConsume: (id: number, status: 'eaten' | 'discarded') => void;
	onEdit: (item: Ingredient) => void;
	onView: (item: Ingredient) => void;
}

export default function IngredientList({
	ingredients,
	sortKey,
	sortOrder,
	onSortKeyChange,
	onSortOrderChange,
	onConsume,
	onEdit,
	onView,
}: Props) {
	const handleSort = (key: typeof sortKey) => {
		if (sortKey === key) {
			onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			onSortKeyChange(key);
			onSortOrderChange('asc');
		}
	};

	const getSortIcon = (key: typeof sortKey) => {
		if (key !== sortKey)
			return (
				<span style={{ marginLeft: 4, color: '#ccc', fontSize: '0.8rem' }}>
					⇅
				</span>
			);
		return (
			<span style={{ marginLeft: 4, color: '#333', fontSize: '0.8rem' }}>
				{sortOrder === 'asc' ? '▲' : '▼'}
			</span>
		);
	};

	const getDDay = (expiration: string) => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const [y, m, d] = expiration.split('-').map(Number);
		const exp = new Date(y, m - 1, d);
		const diffMs = exp.getTime() - today.getTime();
		return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	};

	const sorted = [...ingredients].sort((a, b) => {
		let compare = 0;
		switch (sortKey) {
			case 'expiration':
				compare =
					new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
				break;
			case 'purchasedAt':
				compare =
					new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
				break;
			case 'category':
				compare = (a.category?.name || '').localeCompare(
					b.category?.name || ''
				);
				break;
			case 'name':
				compare = a.name.localeCompare(b.name);
				break;
		}
		return sortOrder === 'asc' ? compare : -compare;
	});

	return (
		<div
			style={{
				backgroundColor: '#fff',
				borderRadius: '12px',
				overflow: 'hidden',
				border: '1px solid #eee',
				boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
			}}
		>
			<table
				style={{
					width: '100%',
					borderCollapse: 'collapse',
					fontSize: '0.95rem',
					color: '#333',
				}}
			>
				<thead>
					<tr style={{ backgroundColor: '#f3f4f6' }}>
						{[
							// 순서 변경: 카테고리 -> 이름 -> 수량 -> ...
							{ key: 'category', label: '카테고리' },
							{ key: 'name', label: '이름' },
							{ key: null, label: '수량' },
							{ key: 'expiration', label: '유통기한' },
							{ key: 'purchasedAt', label: '구매일' },
							{ key: null, label: '관리' },
						].map(({ key, label }) => (
							<th
								key={label}
								onClick={() => key && handleSort(key as Props['sortKey'])}
								style={{
									textAlign: 'center',
									padding: '0.8rem',
									fontWeight: 600,
									cursor: key ? 'pointer' : 'default',
									userSelect: 'none',
									color: '#444',
									borderBottom: '1px solid #eee',
								}}
							>
								{label}
								{key && getSortIcon(key as Props['sortKey'])}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{sorted.map((i, index) => {
						const dDay = getDDay(i.expiration);
						const isExpired = dDay < 0;
						const isUrgent = dDay >= 0 && dDay <= 3;

						return (
							<tr
								key={i.id}
								style={{
									borderBottom:
										index === sorted.length - 1 ? 'none' : '1px solid #eee',
									transition: 'background-color 0.1s',
									backgroundColor: isExpired ? '#fff5f5' : 'inherit',
								}}
							>
								{/* 1. 카테고리 */}
								<td style={{ ...cellStyle, color: '#666' }}>
									{i.category?.name}
								</td>

								{/* 2. 이름 */}
								<td style={cellStyle}>
									<span
										style={{ fontWeight: 500, cursor: 'pointer' }}
										onClick={() => onView(i)}
									>
										{i.name}
									</span>
								</td>

								{/* 3. 수량 */}
								<td style={cellStyle}>
									{i.quantity}{' '}
									<span style={{ fontSize: '0.85rem', color: '#888' }}>
										{i.unit}
									</span>
								</td>

								{/* 4. 유통기한 */}
								<td style={cellStyle}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '6px',
											color: isExpired || isUrgent ? '#d32f2f' : '#333',
											fontWeight: isExpired || isUrgent ? 600 : 400,
										}}
									>
										{new Date(i.expiration).toLocaleDateString()}
										{isUrgent && (
											<span
												style={{
													backgroundColor: '#ffebee',
													color: '#c62828',
													padding: '2px 6px',
													borderRadius: '4px',
													fontSize: '0.75rem',
													border: '1px solid #ffcdd2',
													whiteSpace: 'nowrap',
												}}
											>
												D-{dDay === 0 ? 'Day' : dDay}
											</span>
										)}
										{isExpired && (
											<span
												style={{
													backgroundColor: '#b71c1c',
													color: '#fff',
													padding: '2px 6px',
													borderRadius: '4px',
													fontSize: '0.75rem',
													whiteSpace: 'nowrap',
												}}
											>
												만료
											</span>
										)}
									</div>
								</td>

								{/* 5. 구매일 */}
								<td style={cellStyle}>
									{new Date(i.purchasedAt).toLocaleDateString()}
								</td>

								{/* 6. 관리 버튼들 */}
								<td style={cellStyle}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											gap: '0.4rem',
											alignItems: 'center',
										}}
									>
										<button
											onClick={() => onView(i)}
											style={actionBtnStyle('#e3f2fd', '#1565c0')}
										>
											상세
										</button>

										<button
											onClick={() => onEdit(i)}
											style={actionBtnStyle('#f5f5f5', '#555')}
										>
											수정
										</button>

										<div
											style={{
												width: '1px',
												height: '1rem',
												backgroundColor: '#ddd',
												margin: '0 2px',
											}}
										/>

										<button
											onClick={() => onConsume(i.id, 'eaten')}
											style={actionBtnStyle('#e8f5e9', '#2e7d32')}
										>
											완료
										</button>
										<button
											onClick={() => onConsume(i.id, 'discarded')}
											style={actionBtnStyle('#ffebee', '#c62828')}
										>
											폐기
										</button>
									</div>
								</td>
							</tr>
						);
					})}
					{ingredients.length === 0 && (
						<tr>
							<td
								colSpan={6}
								style={{ textAlign: 'center', padding: '2rem', color: '#999' }}
							>
								등록된 재료가 없습니다.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

const cellStyle: React.CSSProperties = {
	textAlign: 'center',
	padding: '0.8rem 0.5rem',
};

const actionBtnStyle = (bg: string, color: string): React.CSSProperties => ({
	backgroundColor: bg,
	color: color,
	border: 'none',
	padding: '0.4rem 0.6rem',
	borderRadius: '8px',
	fontSize: '0.8rem',
	fontWeight: 600,
	cursor: 'pointer',
	transition: 'opacity 0.2s',
	whiteSpace: 'nowrap',
});
