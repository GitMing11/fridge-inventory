'use client';

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

	const confirmBtnColorClass =
		status === 'eaten'
			? 'bg-green-700 hover:bg-green-800'
			: 'bg-red-700 hover:bg-red-800';

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-[320px] transform overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl transition-all"
			>
				<h3 className="mb-4 text-xl font-bold text-gray-900">
					{item.name} {statusText}
				</h3>

				<p className="text-sm font-medium text-gray-500">
					현재 수량: <span className="text-gray-900">{item.quantity}</span>{' '}
					{item.unit}
				</p>

				<form
					onSubmit={handleSubmit}
					className="mt-6"
				>
					<div className="mb-6">
						<label className="mb-2 block text-sm font-semibold text-gray-700">
							얼마나 {status === 'eaten' ? '드셨나요?' : '버리시나요?'}
						</label>
						<input
							type="number"
							step="any"
							max={item.quantity}
							min="0"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-center text-lg font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
							autoFocus
						/>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
						>
							취소
						</button>
						<button
							type="submit"
							className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg ${confirmBtnColorClass}`}
						>
							확인
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
