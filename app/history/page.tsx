'use client';

import React, { useEffect, useState } from 'react';
import {
	History,
	Inbox,
	CheckCircle2,
	Trash2,
	Calendar,
	ShoppingBag,
	Tag,
} from 'lucide-react';

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

	// --- [추가] 모바일용 카드 컴포넌트 ---
	const MobileHistoryCard = ({ item }: { item: HistoryItem }) => {
		const isEaten = item.status === 'eaten';

		return (
			<div className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-5 shadow-sm">
				{/* 상단: 카테고리 & 상태 뱃지 */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Tag size={12} />
						<span className="rounded-lg bg-input-bg px-2 py-0.5">
							{item.categoryName}
						</span>
					</div>
					<span
						className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
							isEaten
								? 'bg-success/10 text-success-foreground'
								: 'bg-danger/10 text-danger-foreground'
						}`}
					>
						{isEaten ? <CheckCircle2 size={12} /> : <Trash2 size={12} />}
						{isEaten ? '사용 완료' : '폐기됨'}
					</span>
				</div>

				{/* 메인: 이름 & 수량 */}
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-bold text-foreground">{item.name}</h3>
					<div className="flex items-center gap-1.5 text-foreground">
						<ShoppingBag
							size={14}
							className="text-muted-foreground"
						/>
						<span className="font-semibold">{item.quantity}</span>
						<span className="text-sm text-muted-foreground">{item.unit}</span>
					</div>
				</div>

				{/* 하단: 날짜 정보 */}
				<div className="mt-1 flex items-center gap-2 border-t border-card-border pt-3 text-xs text-muted-foreground">
					<Calendar size={12} />
					<span>처리일: {new Date(item.consumedAt).toLocaleDateString()}</span>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
				{/* 헤더 섹션 */}
				<div className="mb-10 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info text-info-foreground">
							<History size={32} />
						</div>
					</div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						소비 / 폐기 기록
					</h1>
					<p className="mt-2 text-muted-foreground">
						지금까지 사용하거나 버린 재료들의 히스토리입니다.
					</p>
				</div>

				{/* 로딩 및 에러 처리 */}
				{loading ? (
					<div className="py-20 text-center text-muted-foreground animate-pulse">
						기록을 불러오는 중입니다...
					</div>
				) : error ? (
					<div className="py-20 text-center font-medium text-danger-solid">
						{error}
					</div>
				) : history.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-input-bg">
							<Inbox
								size={32}
								className="opacity-50"
							/>
						</div>
						<p>아직 기록이 없습니다.</p>
					</div>
				) : (
					<>
						{/* --- 모바일 뷰 (sm 미만에서 보임) --- */}
						<div className="flex flex-col gap-4 sm:hidden">
							{history.map((item) => (
								<MobileHistoryCard
									key={item.id}
									item={item}
								/>
							))}
						</div>

						{/* --- PC 뷰 (sm 이상에서 보임) --- */}
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
										{history.map((item) => (
											<tr
												key={item.id}
												className="transition-colors hover:bg-input-bg/30"
											>
												<td className="px-4 py-4 text-center font-bold text-foreground">
													{item.name}
												</td>
												<td className="px-4 py-4 text-center">
													<span className="inline-flex items-center rounded-full bg-input-bg px-2.5 py-1 text-xs font-medium text-muted-foreground">
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
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
