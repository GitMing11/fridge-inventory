'use client';

import Link from 'next/link';
import { MoveLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from '../../actions/authActions';

export default function SignupPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const result = await signupAction(formData);

		if (result.success) {
			alert(result.message); // "가입이 완료되었습니다." 또는 "이메일을 확인해주세요."
			router.push('/login'); // 로그인 페이지로 이동
		} else {
			setError(result.error || '가입 중 오류가 발생했습니다.');
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 py-8">
			<div className="w-full max-w-sm space-y-6">
				<div className="text-center">
					<Link
						href="/login"
						className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-text-heading transition-colors"
					>
						<MoveLeft className="mr-2 h-4 w-4" />
						로그인으로 돌아가기
					</Link>
					<h2 className="text-2xl font-bold tracking-tight text-text-heading">
						회원가입
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						이메일로 간편하게 가입하세요.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-sm font-medium text-text-heading"
						>
							이메일
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							placeholder="example@email.com"
							className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-text-brand/20 transition-all"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="name"
							className="text-sm font-medium text-text-heading"
						>
							이름 (닉네임)
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="길동이"
							className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-text-brand/20 transition-all"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-sm font-medium text-text-heading"
						>
							비밀번호
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							minLength={6}
							placeholder="6자 이상 입력"
							className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-text-brand/20 transition-all"
						/>
					</div>

					{error && (
						<div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
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
							'가입하기'
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
