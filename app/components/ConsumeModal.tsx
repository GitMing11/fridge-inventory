// app / components / ConsumeModal.tsx

import React, { useState } from 'react';
import { Ingredient } from '../../types';

interface Props {
	item: Ingredient;
	status: 'eaten' | 'discarded';
	onConfirm: (quantity: number) => void;
	onClose: () => void;
}

export default function ConsumeModal({
	item,
	status,
	onConfirm,
	onClose,
}: Props) {
	// 기본값은 현재 전체 수량
	const [amount, setAmount] = useState<number>(item.quantity);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (amount <= 0 || amount > item.quantity) {
			alert('올바른 수량을 입력해주세요.');
			return;
		}
		onConfirm(amount);
	};

	const statusText = status === 'eaten' ? '완료(섭취)' : '폐기';
	const btnColor = status === 'eaten' ? '#2e7d32' : '#c62828';

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
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1200,
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					backgroundColor: '#fff',
					padding: '2rem',
					borderRadius: '16px',
					width: '300px',
					textAlign: 'center',
					boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
				}}
			>
				<h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>
					{item.name} {statusText}
				</h3>

				<p style={{ color: '#666', fontSize: '0.9rem' }}>
					현재 수량: {item.quantity} {item.unit}
				</p>

				<form onSubmit={handleSubmit}>
					<div style={{ margin: '1.5rem 0' }}>
						<label
							style={{
								display: 'block',
								marginBottom: '0.5rem',
								fontWeight: 600,
							}}
						>
							얼마나 {status === 'eaten' ? '드셨나요?' : '버리시나요?'}
						</label>
						<input
							type="number"
							step="any" // 소수점 단위도 가능하게 하려면 설정
							max={item.quantity}
							min="0"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							style={{
								width: '100%',
								padding: '0.8rem',
								fontSize: '1rem',
								border: '1px solid #ddd',
								borderRadius: '8px',
								textAlign: 'center',
							}}
							autoFocus
						/>
					</div>

					<div style={{ display: 'flex', gap: '0.5rem' }}>
						<button
							type="button"
							onClick={onClose}
							style={{
								flex: 1,
								padding: '0.8rem',
								border: 'none',
								backgroundColor: '#f5f5f5',
								color: '#666',
								borderRadius: '8px',
								cursor: 'pointer',
								fontWeight: 600,
							}}
						>
							취소
						</button>
						<button
							type="submit"
							style={{
								flex: 1,
								padding: '0.8rem',
								border: 'none',
								backgroundColor: btnColor,
								color: '#fff',
								borderRadius: '8px',
								cursor: 'pointer',
								fontWeight: 600,
							}}
						>
							확인
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
