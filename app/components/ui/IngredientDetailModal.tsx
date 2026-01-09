'use client';

import React from 'react';
import { Ingredient } from '../../../types';
import { X, Calendar, Tag, Package, Clock, ShoppingBag } from 'lucide-react';

interface Props {
	item: Ingredient;
	onClose: () => void;
}

export default function IngredientDetailModal({ item, onClose }: Props) {
	// 날짜 포맷팅 함수
	const formatDate = (dateStr: string) => {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
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
	let dDayBadgeClass = '';

	// D-Day 텍스트 및 배지 스타일 결정
	if (dDay === 0) {
		dDayText = 'D-Day';
		dDayBadgeClass =
			'bg-danger text-danger-foreground ring-1 ring-inset ring-danger-foreground/20';
	} else if (dDay > 0) {
		dDayText = `D-${dDay}`;
		// 3일 이하 임박: 주황, 그 외: 초록
		dDayBadgeClass =
			dDay <= 3
				? 'bg-warning text-warning-foreground ring-1 ring-inset ring-warning-foreground/20'
				: 'bg-success text-success-foreground ring-1 ring-inset ring-success-foreground/20';
	} else {
		dDayText = `만료 (D+${Math.abs(dDay)})`;
		dDayBadgeClass =
			'bg-neutral text-neutral-foreground ring-1 ring-inset ring-neutral-foreground/20';
	}

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-sm transition-opacity p-4"
		>
			{/* 모달 콘텐츠 */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-full max-w-[450px] overflow-hidden rounded-3xl bg-card border border-card-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
			>
				{/* 헤더 (배경색 + 닫기 버튼) */}
				<div className="relative h-32 bg-input-bg border-b border-card-border">
					<button
						onClick={onClose}
						className="absolute right-5 top-5 rounded-full p-2 bg-card text-muted-foreground transition-colors hover:text-foreground shadow-sm hover:shadow-md"
					>
						<X size={20} />
					</button>

					{/* 아이콘 및 타이틀 오버랩 효과를 위한 공간 */}
					<div className="absolute -bottom-10 left-8 flex items-end gap-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-card-border shadow-lg text-4xl">
							{/* 카테고리별 아이콘 매핑이 없다면 기본 이모지 사용 */}
							🥡
						</div>
					</div>
				</div>

				{/* 본문 내용 */}
				<div className="pt-14 px-8 pb-8 flex flex-col gap-6">
					{/* 타이틀 섹션 */}
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h2 className="text-2xl font-bold text-foreground">
								{item.name}
							</h2>
							<span
								className={`px-2 py-0.5 rounded-md text-xs font-bold ${dDayBadgeClass}`}
							>
								{dDayText}
							</span>
						</div>
						<p className="text-sm text-muted-foreground flex items-center gap-1.5">
							<Tag size={14} />
							{item.category?.name || '미분류'}
						</p>
					</div>

					{/* 상세 정보 그리드 */}
					<div className="grid grid-cols-2 gap-4">
						<InfoCard
							icon={<ShoppingBag size={18} />}
							label="수량"
							value={`${item.quantity} ${item.unit}`}
						/>
						<InfoCard
							icon={<Calendar size={18} />}
							label="유통기한"
							value={formatDate(item.expiration)}
							highlight={dDay <= 3 && dDay >= 0} // 임박 시 강조
						/>
						<InfoCard
							icon={<Clock size={18} />}
							label="구매일"
							value={formatDate(item.purchasedAt)}
						/>
						<InfoCard
							icon={<Package size={18} />}
							label="등록일"
							value={formatDate(item.createdAt)}
						/>
					</div>

					{/* 하단 닫기 버튼 */}
					<button
						onClick={onClose}
						className="mt-2 w-full rounded-xl bg-input-bg border border-input-border py-3.5 text-base font-bold text-muted-foreground transition-all hover:bg-card-border hover:text-foreground active:scale-[0.98]"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
}

// 정보 카드 컴포넌트
function InfoCard({
	icon,
	label,
	value,
	highlight = false,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<div
			className={`p-4 rounded-2xl border transition-colors ${
				highlight
					? 'bg-highlight-bg border-highlight-border'
					: 'bg-input-bg/50 border-input-border'
			}`}
		>
			<div
				className={`mb-2 ${
					highlight ? 'text-highlight-label' : 'text-muted-foreground'
				}`}
			>
				{icon}
			</div>
			<p className="text-xs font-medium text-muted-foreground mb-0.5">
				{label}
			</p>
			<p
				className={`font-semibold ${
					highlight ? 'text-highlight-value' : 'text-foreground'
				}`}
			>
				{value}
			</p>
		</div>
	);
}
