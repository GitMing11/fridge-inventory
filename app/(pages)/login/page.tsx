// app/login/page.tsx
'use client';

import { createClient } from '../../../lib/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../../actions/authActions';

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();
	const router = useRouter();

	// 이메일 로그인 처리
	const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const result = await loginAction(formData);

		if (result.success) {
			router.push('/'); // 로그인 성공 시 홈으로
			router.refresh(); // 헤더 업데이트 등을 위해 새로고침
		} else {
			setError(result.error || '로그인 실패');
			setIsLoading(false);
		}
	};

	// OAuth 로그인 처리
	const handleOAuthLogin = (provider: 'google' | 'kakao') => {
		supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 py-8">
			<div className="w-full max-w-sm space-y-6">
				{/* 상단: 타이틀 */}
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-text-heading">
						환영합니다 👋
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						냉장고 재고 관리를 위해 로그인해주세요.
					</p>
				</div>

				{/* 1. 이메일 로그인 폼 */}
				<form
					onSubmit={handleEmailLogin}
					className="space-y-4"
				>
					<div className="space-y-2">
						<input
							name="email"
							type="email"
							required
							placeholder="이메일"
							className="w-full px-4 py-3 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-text-brand/20 transition-all"
						/>
						<input
							name="password"
							type="password"
							required
							placeholder="비밀번호"
							className="w-full px-4 py-3 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-text-brand/20 transition-all"
						/>
					</div>

					{error && (
						<div className="text-sm text-red-500 bg-red-50 p-2 rounded text-center">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-4 bg-text-brand text-white rounded-lg font-bold shadow-md hover:bg-text-brand/90 transition-all disabled:opacity-70 flex items-center justify-center"
					>
						{isLoading ? (
							<Loader2 className="animate-spin h-5 w-5" />
						) : (
							'로그인'
						)}
					</button>
				</form>

				{/* 회원가입 링크 */}
				<div className="text-center text-sm">
					<span className="text-muted-foreground">계정이 없으신가요? </span>
					<Link
						href="/signup"
						className="font-semibold text-text-brand hover:underline"
					>
						회원가입
					</Link>
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							또는 소셜 로그인
						</span>
					</div>
				</div>

				{/* 2. OAuth 로그인 버튼 영역 */}
				<div className="space-y-3">
					{/* 구글 로그인 */}
					<button
						onClick={() => handleOAuthLogin('google')}
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
						onClick={() => handleOAuthLogin('kakao')}
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
