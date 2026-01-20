import React from 'react';
import { HistoryItem } from '../../../types';
import { CheckCircle2, Trash2, Inbox } from 'lucide-react';
import MobileHistoryCard from './MobileHistoryCard';
interface HistoryListProps {
	history: HistoryItem[];
}
import { CATEGORY_COLORS } from '../../constants';

export default function HistoryList({ history }: HistoryListProps) {
	if (history.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-input-bg">
					<Inbox
						size={32}
						className="opacity-50"
					/>
				</div>
				<p>아직 기록이 없습니다.</p>
			</div>
		);
	}

	return (
		<>
			{/* --- 모바일 뷰 --- */}
			<div className="flex flex-col gap-4 sm:hidden">
				{history.map((item) => (
					<MobileHistoryCard
						key={item.id}
						item={item}
					/>
				))}
			</div>

			{/* --- PC 뷰 --- */}
			<div className="hidden overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm sm:block">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-card-border bg-input-bg/50">
								{['이름', '카테고리', '수량', '상태', '처리일'].map(
									(header) => (
										<th
											key={header}
											className="whitespace-nowrap px-4 py-5 text-center font-semibold text-muted-foreground"
										>
											{header}
										</th>
									)
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-card-border">
							{history.map((item) => {
								// 1. 카테고리 색상 결정 로직
								// HistoryItem에 category 객체가 포함되어 있거나, 별도의 categoryColor 필드가 있다고 가정합니다.
								// 데이터가 없을 경우 안전하게 'gray'를 사용합니다.
								const categoryColor =
									(item as any).category?.color || // Prisma include 사용 시
									(item as any).categoryColor || // 별도 필드 사용 시
									'gray';

								const colorKey = categoryColor as keyof typeof CATEGORY_COLORS;
								const colorClass =
									CATEGORY_COLORS[colorKey] || CATEGORY_COLORS['gray'];

								return (
									<tr
										key={item.id}
										className="transition-colors hover:bg-input-bg/30"
									>
										<td className="px-4 py-4 text-center font-bold text-foreground">
											{item.name}
										</td>

										{/* 2. 카테고리 뱃지 색상 적용 */}
										<td className="px-4 py-4 text-center">
											<span
												className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${colorClass}`}
											>
												{item.categoryName}
											</span>
										</td>

										<td className="px-4 py-4 text-center font-medium text-foreground">
											{item.quantity}
											<span className="ml-0.5 text-xs text-muted-foreground">
												{item.unit}
											</span>
										</td>
										<td className="px-4 py-4 text-center">
											<span
												className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
													item.status === 'eaten'
														? 'bg-success text-success-foreground ring-success-foreground/20'
														: 'bg-danger text-danger-foreground ring-danger-foreground/20'
												}`}
											>
												{item.status === 'eaten' ? (
													<>
														<CheckCircle2 size={12} />
														사용 완료
													</>
												) : (
													<>
														<Trash2 size={12} />
														폐기됨
													</>
												)}
											</span>
										</td>
										<td className="px-4 py-4 text-center text-muted-foreground">
											{new Date(item.consumedAt).toLocaleDateString()}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
