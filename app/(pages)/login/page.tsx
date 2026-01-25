// app/login/page.tsx
'use client';

import { createClient } from '../../../lib/supabase/client';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();

	const handleLogin = (provider: 'google' | 'kakao') => {
		supabase.auth.signInWithOAuth({
			provider,
			options: {
				// 로그인이 끝나면 위의 callback 라우트로 돌아오게 설정
				redirectTo: `${location.origin}/auth/callback`,
				queryParams:
					provider === 'kakao'
						? {
								scope: 'profile_nickname,profile_image', // 이메일(account_email) 제외
							}
						: undefined,
			},
		});
	};

	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 py-8">
			<div className="w-full max-w-sm space-y-8">
				{/* 상단: 뒤로가기 및 타이틀 */}
				<div className="text-center">
					<Link
						href="/"
						className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-text-heading transition-colors"
					>
						<MoveLeft className="mr-2 h-4 w-4" />
						홈으로 돌아가기
					</Link>
					<h2 className="text-3xl font-bold tracking-tight text-text-heading">
						환영합니다 👋
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						냉장고 재고 관리를 위해 로그인해주세요.
					</p>
				</div>

				{/* 로그인 버튼 영역 */}
				<div className="space-y-3">
					{/* 구글 로그인 */}
					<button
						onClick={() => handleLogin('google')}
						disabled={isLoading}
						className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-70 transition-all"
					>
						<svg
							className="mr-3 h-5 w-5"
							viewBox="0 0 24 24"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Google로 계속하기
					</button>

					{/* 카카오 로그인 */}
					<button
						onClick={() => handleLogin('kakao')}
						disabled={isLoading}
						className="flex w-full items-center justify-center rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#000000] shadow-sm hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-[#FEE500] disabled:opacity-70 transition-all"
					>
						<svg
							className="mr-3 h-5 w-5"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 3C5.925 3 1 6.925 1 11.775c0 3.1 1.975 5.825 5 7.375-.225.825-.825 3-0.95 3.475-.15.55.2.55.425.375.275-.2 4.325-2.925 5.075-3.425.475.075.975.125 1.45.125 6.075 0 11-3.925 11-8.775S16.075 3 12 3z" />
						</svg>
						카카오로 계속하기
					</button>
				</div>
			</div>
		</div>
	);
}
