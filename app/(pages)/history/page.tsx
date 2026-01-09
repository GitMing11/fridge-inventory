'use client';

import React from 'react';
import { History } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import HistoryList from '../../components/ui/HistoryList';

export default function HistoryPage() {
	const { history, loading, error } = useHistory();

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
				) : (
					<HistoryList history={history} />
				)}
			</div>
		</div>
	);
}
