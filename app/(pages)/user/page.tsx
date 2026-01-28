'use client';

import { createClient } from '../../../lib/supabase/client';
import { User } from '@supabase/supabase-js';
import {
	LogOut,
	User as UserIcon,
	Mail,
	Calendar,
	Refrigerator,
	Edit3,
	ShieldAlert,
	ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteAccountAction } from '../../actions/authActions';

export default function UserPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				router.replace('/login');
				return;
			}
			setUser(user);
			setLoading(false);
		};
		getUser();
	}, [router, supabase]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.replace('/');
		router.refresh();
	};

	// ✨ 회원 탈퇴 핸들러 추가
	const handleWithdraw = async () => {
		const confirmed = window.confirm(
			'정말로 탈퇴하시겠습니까?\n작성한 모든 데이터가 삭제되며 복구할 수 없습니다.',
		);

		if (confirmed) {
			setLoading(true); // 로딩 표시
			const result = await deleteAccountAction();

			if (result.success) {
				alert('탈퇴가 완료되었습니다.');
				router.replace('/');
				router.refresh();
			} else {
				alert(result.error || '탈퇴 처리에 실패했습니다.');
				setLoading(false);
			}
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center text-muted-foreground">
				로딩 중...
			</div>
		);

	if (!user) return null;

	const joinDate = new Date(user.created_at).toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<main className="px-4 py-8 md:px-8 md:py-12 max-w-5xl mx-auto w-full space-y-8">
				{/* 1. 페이지 헤더 */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-text-heading">마이페이지</h1>
						<p className="text-muted-foreground text-sm mt-1">
							내 계정 정보와 활동을 관리합니다.
						</p>
					</div>
				</div>

				{/* 2. 프로필 카드 섹션 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* 왼쪽: 프로필 요약 카드 */}
					<section className="md:col-span-1 bg-card border border-card-border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center h-fit">
						<div className="relative w-28 h-28 mb-4">
							<div className="w-full h-full rounded-full border-4 border-background shadow-md overflow-hidden bg-neutral">
								{user.user_metadata.avatar_url ? (
									<img
										src={user.user_metadata.avatar_url}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-muted-foreground">
										<UserIcon size={48} />
									</div>
								)}
							</div>
							<button className="absolute bottom-0 right-0 p-2 bg-card border border-card-border rounded-full shadow-sm text-muted-foreground hover:text-text-brand hover:border-text-brand transition-colors">
								<Edit3 size={16} />
							</button>
						</div>

						<h2 className="text-xl font-bold text-text-heading">
							{user.user_metadata.full_name || '사용자'}
						</h2>
						<p className="text-sm text-muted-foreground mt-1">{user.email}</p>

						<div className="w-full mt-6 pt-6 border-t border-card-border space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground flex items-center gap-2">
									<Calendar size={14} /> 가입일
								</span>
								<span className="font-medium text-text-heading">
									{joinDate}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground flex items-center gap-2">
									<Mail size={14} /> 인증 상태
								</span>
								<span className="font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full text-xs">
									인증됨
								</span>
							</div>
						</div>
					</section>

					{/* 오른쪽: 상세 설정 및 활동 영역 */}
					<div className="md:col-span-2 space-y-6">
						{/* 활동 요약 (Stats) */}
						<section className="grid grid-cols-2 gap-4">
							<div className="bg-card border border-card-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
										<Refrigerator size={20} />
									</div>
									<span className="text-sm font-medium text-muted-foreground">
										참여 냉장고
									</span>
								</div>
								<p className="text-2xl font-bold text-text-heading">
									1{' '}
									<span className="text-sm font-normal text-muted-foreground">
										개
									</span>
								</p>
							</div>

							<div className="bg-card border border-card-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
								{/* 추후 추가될 기능 예시 */}
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl">
										<ShieldAlert size={20} />
									</div>
									<span className="text-sm font-medium text-muted-foreground">
										알림 설정
									</span>
								</div>
								<p className="text-sm text-text-heading mt-1">
									유통기한 임박 알림{' '}
									<span className="font-bold text-amber-500">ON</span>
								</p>
							</div>
						</section>

						{/* 계정 관리 메뉴 */}
						<section className="bg-card border border-card-border rounded-3xl overflow-hidden shadow-sm">
							<div className="px-6 py-4 border-b border-card-border">
								<h3 className="font-bold text-text-heading">계정 관리</h3>
							</div>
							<div className="divide-y divide-card-border">
								<button className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral/50 transition-colors text-left group">
									<div>
										<p className="text-sm font-medium text-text-heading group-hover:text-text-brand transition-colors">
											프로필 수정
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											닉네임 및 프로필 사진 변경
										</p>
									</div>
									<ChevronRight
										size={18}
										className="text-muted-foreground group-hover:text-text-brand"
									/>
								</button>

								<button
									onClick={handleLogout}
									className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral/50 transition-colors text-left group"
								>
									<div className="flex items-center gap-2">
										<LogOut
											size={18}
											className="text-muted-foreground group-hover:text-text-heading"
										/>
										<span className="text-sm font-medium text-text-heading">
											로그아웃
										</span>
									</div>
								</button>
							</div>
						</section>

						{/* Danger Zone */}
						<section className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl overflow-hidden">
							<div className="px-6 py-4">
								<h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
									<ShieldAlert size={18} /> Danger Zone
								</h3>
							</div>
							<div className="px-6 pb-6">
								<p className="text-xs text-red-600/70 dark:text-red-400/70 mb-4">
									탈퇴 시 작성한 모든 데이터가 삭제되며 복구할 수 없습니다.
								</p>
								<button
									onClick={handleWithdraw}
									className="px-4 py-2 bg-white dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
								>
									회원 탈퇴하기
								</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
