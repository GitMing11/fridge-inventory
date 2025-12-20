'use client';

import React, { useEffect, useState } from 'react';

interface HistoryItem {
	id: number;
	name: string;
	categoryName: string;
	quantity: number;
	unit: string;
	expiration: string;
	purchasedAt: string;
	consumedAt: string;
	status: 'eaten' | 'discarded';
}

export default function HistoryPage() {
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch('/api/history')
			.then((res) => {
				if (!res.ok) throw new Error('API 호출 실패');
				return res.json();
			})
			.then((data) => {
				setHistory(data);
				setError(null);
			})
			.catch((e) => {
				console.error(e);
				setError('기록을 불러오는 데 실패했습니다.');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div
			style={{
				maxWidth: 650,
				margin: '1rem auto',
				padding: '2rem',
				backgroundColor: '#f9f9f9',
				borderRadius: '16px', // 둥글게 (메인과 통일)
				border: '1px solid #eee',
				boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // 부드러운 그림자 추가
				fontFamily: 'Arial, sans-serif',
				color: '#333',
			}}
		>
			<h1
				style={{
					textAlign: 'center',
					marginBottom: '2rem',
					color: '#222',
					fontWeight: 600,
					fontSize: '1.75rem',
				}}
			>
				소비 / 폐기 기록
			</h1>

			{loading ? (
				<div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
					기록을 불러오는 중입니다...
				</div>
			) : error ? (
				<div style={{ textAlign: 'center', padding: '2rem', color: '#e57373' }}>
					{error}
				</div>
			) : history.length === 0 ? (
				<div
					style={{
						textAlign: 'center',
						padding: '3rem',
						color: '#888',
						backgroundColor: '#fff',
						borderRadius: '12px',
						border: '1px solid #eee',
					}}
				>
					<p style={{ margin: 0 }}>아직 기록이 없습니다.</p>
				</div>
			) : (
				<div
					style={{
						backgroundColor: '#fff',
						borderRadius: '12px',
						overflow: 'hidden', // 테두리 둥글게 유지
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
								<th style={headerCellStyle}>이름</th>
								<th style={headerCellStyle}>카테고리</th>
								<th style={headerCellStyle}>수량</th>
								<th style={headerCellStyle}>상태</th>
								<th style={headerCellStyle}>처리일</th>
							</tr>
						</thead>
						<tbody>
							{history.map((item, index) => (
								<tr
									key={item.id}
									style={{
										borderBottom:
											index === history.length - 1 ? 'none' : '1px solid #eee',
										transition: 'background-color 0.2s',
									}}
								>
									<td style={cellStyle}>{item.name}</td>
									<td
										style={{ ...cellStyle, color: '#666', fontSize: '0.9rem' }}
									>
										{item.categoryName}
									</td>
									<td style={cellStyle}>
										{item.quantity}
										<span
											style={{
												fontSize: '0.85rem',
												color: '#888',
												marginLeft: 2,
											}}
										>
											{item.unit}
										</span>
									</td>
									<td style={cellStyle}>
										<span
											style={{
												padding: '0.25rem 0.6rem',
												borderRadius: '20px',
												fontSize: '0.8rem',
												fontWeight: 600,
												backgroundColor:
													item.status === 'eaten' ? '#e8f5e9' : '#ffebee',
												color: item.status === 'eaten' ? '#2e7d32' : '#c62828',
												display: 'inline-block',
											}}
										>
											{item.status === 'eaten' ? '사용 완료' : '폐기됨'}
										</span>
									</td>
									<td style={{ ...cellStyle, color: '#555' }}>
										{new Date(item.consumedAt).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

const headerCellStyle: React.CSSProperties = {
	textAlign: 'center',
	padding: '0.8rem',
	fontWeight: 600,
	color: '#444',
	fontSize: '0.9rem',
};

const cellStyle: React.CSSProperties = {
	textAlign: 'center',
	padding: '0.8rem 0.5rem',
};
