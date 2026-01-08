'use client';

import React, { useEffect, useState } from 'react';
import { History, Inbox, CheckCircle2, Trash2 } from 'lucide-react';

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
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="mx-auto max-w-5xl px-4 py-12">
				{/* 헤더 섹션 */}
				<div className="mb-10 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
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

				{loading ? (
					<div className="py-20 text-center text-muted-foreground animate-pulse">
						기록을 불러오는 중입니다...
					</div>
				) : error ? (
					<div className="py-20 text-center text-rose-500 font-medium">
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
					// 리스트 영역
					<div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="bg-input-bg/50 border-b border-card-border">
										{['이름', '카테고리', '수량', '상태', '처리일'].map(
											(header) => (
												<th
													key={header}
													className="whitespace-nowrap px-4 py-5 font-semibold text-muted-foreground text-center"
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
											{/* 이름 */}
											<td className="px-4 py-4 text-center font-bold text-foreground">
												{item.name}
											</td>

											{/* 카테고리 */}
											<td className="px-4 py-4 text-center">
												<span className="inline-flex items-center rounded-full bg-input-bg px-2.5 py-1 text-xs font-medium text-muted-foreground">
													{item.categoryName}
												</span>
											</td>

											{/* 수량 */}
											<td className="px-4 py-4 text-center font-medium text-foreground">
												{item.quantity}
												<span className="ml-0.5 text-xs text-muted-foreground">
													{item.unit}
												</span>
											</td>

											{/* 상태 (배지 스타일) */}
											<td className="px-4 py-4 text-center">
												<span
													className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
														item.status === 'eaten'
															? 'bg-emerald-100 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400'
															: 'bg-rose-100 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400'
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

											{/* 처리일 */}
											<td className="px-4 py-4 text-center text-muted-foreground">
												{new Date(item.consumedAt).toLocaleDateString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
