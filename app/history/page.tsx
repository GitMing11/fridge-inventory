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
		<div className="mx-auto my-8 max-w-5xl rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
			<h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
				소비 / 폐기 기록
			</h1>

			{loading ? (
				<div className="py-12 text-center text-gray-500">
					기록을 불러오는 중입니다...
				</div>
			) : error ? (
				<div className="py-12 text-center text-red-500">{error}</div>
			) : history.length === 0 ? (
				<div className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-400 shadow-sm">
					아직 기록이 없습니다.
				</div>
			) : (
				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<table className="w-full border-collapse text-sm text-gray-800">
						<thead>
							<tr className="bg-gray-100/80">
								<th className="border-b border-gray-200 p-4 font-semibold text-gray-600">
									이름
								</th>
								<th className="border-b border-gray-200 p-4 font-semibold text-gray-600">
									카테고리
								</th>
								<th className="border-b border-gray-200 p-4 font-semibold text-gray-600">
									수량
								</th>
								<th className="border-b border-gray-200 p-4 font-semibold text-gray-600">
									상태
								</th>
								<th className="border-b border-gray-200 p-4 font-semibold text-gray-600">
									처리일
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{history.map((item) => (
								<tr
									key={item.id}
									className="transition-colors hover:bg-gray-50"
								>
									<td className="p-4 text-center font-medium">{item.name}</td>
									<td className="p-4 text-center text-gray-500">
										{item.categoryName}
									</td>
									<td className="p-4 text-center font-medium">
										{item.quantity}
										<span className="ml-0.5 text-xs text-gray-400">
											{item.unit}
										</span>
									</td>
									<td className="p-4 text-center">
										<span
											className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
												item.status === 'eaten'
													? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
													: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
											}`}
										>
											{item.status === 'eaten' ? '사용 완료' : '폐기됨'}
										</span>
									</td>
									<td className="p-4 text-center text-gray-500">
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
