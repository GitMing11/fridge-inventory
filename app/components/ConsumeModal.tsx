'use client';

import React, { useState } from 'react';
import { Ingredient } from '../../types';
import toast from 'react-hot-toast';

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
			toast.error('올바른 수량을 입력해주세요.');
			return;
		}
		const message =
			status === 'eaten' ? '맛있게 드셨나요? 😋' : '폐기되었습니다. 🗑️';
		toast.success(message);

		onConfirm(amount);
	};

	const isEaten = status === 'eaten';
	const statusText = isEaten ? '완료(섭취)' : '폐기';

	const confirmBtnColorClass = isEaten
		? 'bg-success-solid hover:bg-success-solid-hover shadow-success-solid/20'
		: 'bg-danger-solid hover:bg-danger-solid-hover shadow-danger-solid/20';

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-sm transition-opacity p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-[320px] overflow-hidden rounded-3xl bg-card border border-card-border p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200"
			>
				<div className="mb-4 flex justify-center">
					<span
						className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
							isEaten ? 'bg-success' : 'bg-danger'
						}`}
					>
						{isEaten ? '😋' : '🗑️'}
					</span>
				</div>

				<h3 className="mb-2 text-xl font-bold text-foreground">
					{item.name} {statusText}
				</h3>

				<p className="text-sm font-medium text-muted-foreground">
					현재 수량:{' '}
					<span className="font-bold text-foreground">{item.quantity}</span>{' '}
					{item.unit}
				</p>

				<form
					onSubmit={handleSubmit}
					className="mt-6"
				>
					<div className="mb-6">
						<label className="mb-2.5 block text-sm font-semibold text-foreground">
							얼마나 {isEaten ? '드셨나요?' : '버리시나요?'}
						</label>
						<input
							type="number"
							step="any"
							max={item.quantity}
							min="0"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							className="w-full rounded-xl border border-input-border bg-input-bg p-3.5 text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
							autoFocus
						/>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-xl bg-input-bg border border-input-border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-card-border hover:text-foreground active:scale-[0.98]"
						>
							취소
						</button>
						<button
							type="submit"
							className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] ${confirmBtnColorClass}`}
						>
							확인
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
