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
	Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteAccountAction } from '../../actions/authActions';
import Image from 'next/image';

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

	// 회원 탈퇴 핸들러
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

	// ✨ 표시 이름 우선순위 : 닉네임 > 전체 이름 > 이름 > '사용자'
	const displayName =
		user.user_metadata.nickname ||
		user.user_metadata.full_name ||
		user.user_metadata.name ||
		'사용자';

	// ✨ 메타데이터에서 프로필 이미지 가져오기
	const avatarUrl =
		user.user_metadata.avatar_url || user.user_metadata.picture || null;

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<main className="px-4 py-8 md:px-8 md:py-12 max-w-5xl mx-auto w-full space-y-8">
				{/* 1. 페이지 제목 */}
				<div>
					<h1 className="text-2xl font-bold text-text-heading">마이페이지</h1>
					<p className="text-muted-foreground text-sm mt-1">
						계정 정보를 확인하고 관리하세요.
					</p>
				</div>

				{/* 2. 상단 프로필 섹션 (가로형 배치) */}
				<section className="bg-card border border-card-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
					{/* 배경 장식 (선택 사항) */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-text-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

					{/* 프로필 이미지 */}
					<div className="relative shrink-0">
						<div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-background shadow-md overflow-hidden bg-neutral">
							{avatarUrl ? (
								<Image
									src={avatarUrl}
									alt="Profile"
									className="w-full h-full object-cover"
									width={112}
									height={112}
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-muted-foreground">
									<UserIcon size={40} />
								</div>
							)}
						</div>
					</div>

					{/* 텍스트 정보 */}
					<div className="flex-1 text-center md:text-left space-y-1 md:space-y-2 z-10">
						<div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
							<h2 className="text-2xl md:text-3xl font-bold text-text-heading">
								{displayName}
							</h2>
							<Link
								href="/user/edit"
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral hover:bg-neutral/80 text-xs font-medium text-text-heading transition-colors"
							>
								<Edit3 size={12} /> 프로필 수정
							</Link>
						</div>
						<p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
							<Mail size={14} /> {user.email}
						</p>
						<p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2">
							<Calendar size={14} /> 가입일: {joinDate}
						</p>
					</div>
				</section>

				{/* 3. 하단 그리드 섹션 (3단 분할) */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* 카드 1: 활동 요약 (냉장고) */}
					<section className="bg-card border border-card-border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-text-brand/30 transition-colors group">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
								<Refrigerator size={24} />
							</div>
							<h3 className="font-bold text-text-heading">나의 냉장고</h3>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								참여 중인 냉장고
							</p>
							<p className="text-3xl font-bold text-text-heading">
								1{' '}
								<span className="text-base font-normal text-muted-foreground">
									개
								</span>
							</p>
						</div>
						<div className="mt-4 pt-4 border-t border-card-border">
							<Link
								href="/"
								className="text-sm text-text-brand font-medium flex items-center gap-1 hover:underline"
							>
								냉장고 관리하러 가기 <ChevronRight size={14} />
							</Link>
						</div>
					</section>

					{/* 카드 2: 계정 작업 (로그아웃 등) */}
					<section className="bg-card border border-card-border rounded-3xl p-6 shadow-sm flex flex-col">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2.5 bg-neutral text-text-heading rounded-2xl">
								<Settings size={24} />
							</div>
							<h3 className="font-bold text-text-heading">설정</h3>
						</div>

						<div className="flex-1 space-y-3">
							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral/50 hover:bg-neutral text-text-heading transition-all group"
							>
								<span className="flex items-center gap-2 font-medium">
									<LogOut size={16} /> 로그아웃
								</span>
								<ChevronRight
									size={16}
									className="text-muted-foreground group-hover:translate-x-1 transition-transform"
								/>
							</button>
							{/* 추후 추가될 설정 메뉴들 */}
							<div className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-card-border text-muted-foreground cursor-not-allowed">
								<span className="flex items-center gap-2 text-sm">
									알림 설정 (준비중)
								</span>
							</div>
						</div>
					</section>

					{/* 카드 3: Danger Zone (탈퇴) */}
					<section className="bg-red-50/30 dark:bg-red-900/5 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 shadow-sm flex flex-col">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-2.5 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl">
								<ShieldAlert size={24} />
							</div>
							<h3 className="font-bold text-red-600 dark:text-red-400">
								Danger Zone
							</h3>
						</div>
						<div className="flex-1">
							<p className="text-sm text-red-600/70 dark:text-red-400/70 mb-6 leading-relaxed">
								회원 탈퇴 시 계정의 모든 정보와 냉장고 데이터가 영구적으로
								삭제됩니다.
							</p>
						</div>
						<button
							onClick={handleWithdraw}
							className="w-full py-3 rounded-xl bg-white dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm text-sm"
						>
							회원 탈퇴하기
						</button>
					</section>
				</div>
			</main>
		</div>
	);
}
