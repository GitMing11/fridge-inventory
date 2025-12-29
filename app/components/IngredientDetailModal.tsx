// app/components/IngredientDetailModal.tsx
import React from 'react';

import { Category, Ingredient } from '../../types';

interface Props {
	item: Ingredient;
	onClose: () => void;
}

export default function IngredientDetailModal({ item, onClose }: Props) {
	// 날짜 포맷팅 함수 (년-월-일 시:분)
	const formatDate = (dateStr: string) => {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// D-Day 계산
	const getDDay = (expiration: string) => {
		const today = new Date();
		const exp = new Date(expiration);

		// 날짜 기준으로만 비교 (시간 제거)
		today.setHours(0, 0, 0, 0);
		exp.setHours(0, 0, 0, 0);

		const diffMs = exp.getTime() - today.getTime();
		return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	};

	const dDay = getDDay(item.expiration);
	const dDayText =
		dDay === 0
			? 'D-Day'
			: dDay > 0
			? `D-${dDay}` // 남은 날짜
			: `만료, D+${Math.abs(dDay)}`; // 만료 후 날짜
	const dDayColor =
		dDay < 0
			? '#9e9e9e' // 만료됨: 회색
			: dDay <= 3
			? '#c62828' // 임박: 빨강
			: '#2e7d32'; // 여유: 초록

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
				zIndex: 1100, // 다른 모달보다 위에 오도록
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					backgroundColor: '#fff',
					borderRadius: '16px',
					padding: '2rem',
					width: '90%',
					maxWidth: '450px',
					boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
					position: 'relative',
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '1.2rem',
						right: '1.2rem',
						background: 'none',
						border: 'none',
						fontSize: '1.5rem',
						cursor: 'pointer',
						color: '#999',
					}}
				>
					&times;
				</button>

				<h2
					style={{
						margin: '0 0 1.5rem 0',
						fontSize: '1.5rem',
						color: '#333',
						textAlign: 'center',
						fontWeight: 700,
					}}
				>
					재료 상세 정보
				</h2>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<DetailRow
						label="이름"
						value={item.name}
						bold
					/>
					<DetailRow
						label="카테고리"
						value={item.category?.name || '-'}
					/>
					<DetailRow
						label="수량"
						value={`${item.quantity} ${item.unit}`}
					/>
					<DetailRow
						label="유통기한"
						value={`${formatDate(item.expiration)} (${dDayText})`}
						valueColor={dDayColor}
					/>
					<DetailRow
						label="구매일"
						value={formatDate(item.purchasedAt)}
					/>

					<div style={{ borderTop: '1px solid #eee', margin: '0.5rem 0' }} />

					<DetailRow
						label="등록일시"
						value={formatDate(item.createdAt)}
					/>
					{item.updatedAt && (
						<DetailRow
							label="최근수정"
							value={formatDate(item.updatedAt)}
						/>
					)}
				</div>

				<button
					onClick={onClose}
					style={{
						marginTop: '2rem',
						width: '100%',
						padding: '0.9rem',
						backgroundColor: '#333',
						color: '#fff',
						fontSize: '1rem',
						fontWeight: 'bold',
						border: 'none',
						borderRadius: '10px',
						cursor: 'pointer',
					}}
				>
					닫기
				</button>
			</div>
		</div>
	);
}

// 상세 정보 한 줄 컴포넌트
function DetailRow({
	label,
	value,
	bold = false,
	valueColor = '#333',
}: {
	label: string;
	value: string;
	bold?: boolean;
	valueColor?: string;
}) {
	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<span
				style={{
					width: '80px',
					color: '#666',
					fontSize: '0.95rem',
					fontWeight: 600,
				}}
			>
				{label}
			</span>
			<span
				style={{
					flex: 1,
					color: valueColor,
					fontSize: '1rem',
					fontWeight: bold ? 700 : 400,
				}}
			>
				{value}
			</span>
		</div>
	);
}
