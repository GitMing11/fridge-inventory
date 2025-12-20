// components/IngredientList.tsx
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
}

interface Props {
	ingredients: Ingredient[];
	sortKey: 'expiration' | 'purchasedAt' | 'category' | 'name';
	sortOrder: 'asc' | 'desc';
	onSortKeyChange: (key: Props['sortKey']) => void;
	onSortOrderChange: (order: Props['sortOrder']) => void;
	onConsume: (id: number, status: 'eaten' | 'discarded') => void;
	onEdit: (item: Ingredient) => void;
}

// D-Day 계산 헬퍼 함수
function getDDay(dateStr: string) {
	const target = new Date(dateStr);
	const today = new Date();

	// 정확한 날짜 차이 계산을 위해 시간을 00:00:00으로 초기화
	target.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	const diffTime = target.getTime() - today.getTime();
	// 밀리초 -> 일 단위 변환
	const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return days;
}

export default function IngredientList({
	ingredients,
	sortKey,
	sortOrder,
	onSortKeyChange,
	onSortOrderChange,
	onConsume,
	onEdit,
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
							{ key: 'name', label: '이름' },
							{ key: null, label: '수량' },
							{ key: 'category', label: '카테고리' },
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
						const daysLeft = getDDay(i.expiration);
						const isExpired = daysLeft < 0;
						const isImminent = daysLeft >= 0 && daysLeft <= 3; // 3일 이내 임박

						return (
							<tr
								key={i.id}
								style={{
									borderBottom:
										index === sorted.length - 1 ? 'none' : '1px solid #eee',
									transition: 'background-color 0.1s',
								}}
							>
								<td style={cellStyle}>
									<span style={{ fontWeight: 500 }}>{i.name}</span>
								</td>
								<td style={cellStyle}>
									{i.quantity}{' '}
									<span style={{ fontSize: '0.85rem', color: '#888' }}>
										{i.unit}
									</span>
								</td>
								<td style={{ ...cellStyle, color: '#666' }}>
									{i.category?.name}
								</td>
								<td style={cellStyle}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '6px',
										}}
									>
										{/* 날짜 표시 */}
										<span
											style={{
												color: isExpired || isImminent ? '#d32f2f' : 'inherit', // 빨간색 강조
												fontWeight: isExpired || isImminent ? 600 : 400,
											}}
										>
											{new Date(i.expiration).toLocaleDateString()}
										</span>

										{/* 뱃지 표시 */}
										{isExpired && (
											<span style={badgeStyle('#ffebee', '#c62828')}>만료</span>
										)}
										{!isExpired && isImminent && (
											<span style={badgeStyle('#ffebee', '#c62828')}>
												{daysLeft === 0 ? 'D-Day' : `D-${daysLeft}`}
											</span>
										)}
									</div>
								</td>
								<td style={cellStyle}>
									{new Date(i.purchasedAt).toLocaleDateString()}
								</td>
								<td style={cellStyle}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											gap: '0.5rem',
											alignItems: 'center',
										}}
									>
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

// 스타일 헬퍼
const cellStyle: React.CSSProperties = {
	textAlign: 'center',
	padding: '0.8rem 0.5rem',
};

const actionBtnStyle = (bg: string, color: string): React.CSSProperties => ({
	backgroundColor: bg,
	color: color,
	border: 'none',
	padding: '0.4rem 0.8rem',
	borderRadius: '8px',
	fontSize: '0.85rem',
	fontWeight: 600,
	cursor: 'pointer',
	transition: 'opacity 0.2s',
});

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
	backgroundColor: bg,
	color: color,
	padding: '2px 6px',
	borderRadius: '6px',
	fontSize: '0.75rem',
	fontWeight: 700,
	whiteSpace: 'nowrap',
});
