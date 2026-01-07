'use client';

import React from 'react';
import { Category, Ingredient } from '../../types';

interface Props {
	item: Ingredient;
	onClose: () => void;
}

export default function IngredientDetailModal({ item, onClose }: Props) {
	// 날짜 포맷팅 함수
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

		today.setHours(0, 0, 0, 0);
		exp.setHours(0, 0, 0, 0);

		const diffMs = exp.getTime() - today.getTime();
		return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	};

	const dDay = getDDay(item.expiration);

	let dDayText = '';
	let dDayColorClass = '';

	// D-Day 텍스트 및 색상 클래스 결정
	if (dDay === 0) {
		dDayText = 'D-Day';
		dDayColorClass = 'text-red-600'; // 당일: 빨강
	} else if (dDay > 0) {
		dDayText = `D-${dDay}`;
		// 3일 이하 임박: 빨강, 그 외: 초록
		dDayColorClass = dDay <= 3 ? 'text-red-600' : 'text-green-600';
	} else {
		dDayText = `만료, D+${Math.abs(dDay)}`;
		dDayColorClass = 'text-gray-400'; // 만료: 회색
	}

	return (
		// 배경 오버레이 (z-index 1100 -> z-[55])
		<div
			onClick={onClose}
			className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
		>
			{/* 모달 콘텐츠 */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-[90%] max-w-[450px] transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all"
			>
				{/* 닫기 'X' 버튼 */}
				<button
					onClick={onClose}
					className="absolute right-5 top-5 p-1 text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600"
				>
					&times;
				</button>

				<h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
					재료 상세 정보
				</h2>

				<div className="flex flex-col gap-4">
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
						valueClassName={dDayColorClass}
					/>
					<DetailRow
						label="구매일"
						value={formatDate(item.purchasedAt)}
					/>

					{/* 구분선 */}
					<div className="my-2 border-t border-gray-100" />

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

				{/* 하단 닫기 버튼 */}
				<button
					onClick={onClose}
					className="mt-8 w-full rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
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
	valueClassName = 'text-gray-900',
}: {
	label: string;
	value: string;
	bold?: boolean;
	valueClassName?: string;
}) {
	return (
		<div className="flex items-center">
			<span className="w-20 text-sm font-semibold text-gray-500">{label}</span>
			<span
				className={`flex-1 text-base ${
					bold ? 'font-bold' : 'font-normal'
				} ${valueClassName}`}
			>
				{value}
			</span>
		</div>
	);
}
