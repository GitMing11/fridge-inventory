'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, LogIn, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function Header() {
	const pathname = usePathname();
	const { isDarkMode, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user, setUser] = useState<SupabaseUser | null>(null);

	const supabase = createClient();

	// 1. 초기 마운트 및 Auth 상태 구독 (OAuth, 토큰 갱신 등 감지)
	useEffect(() => {
		setMounted(true);

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	// 2. 경로(pathname)가 바뀔 때마다 유저 정보를 재검증
	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};

		getUser();
	}, [supabase, pathname]);

	// 페이지 이동 시 모바일 메뉴 닫기
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	const today = new Date().toLocaleDateString('ko-KR', {
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	});

	const navItems = [
		{ name: '기록', href: '/history' },
		{ name: '메인', href: '/main' },
		{ name: '카테고리', href: '/categories' },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-header-border bg-header-bg/80 backdrop-blur-md transition-colors duration-300">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				{/* 1. Left: 로고 & 날짜 */}
				<Link
					href="/"
					className="flex flex-col justify-center hover:opacity-80 transition-opacity cursor-pointer group"
				>
					<div className="flex items-center gap-2">
						<span className="text-xl transition-transform duration-300 group-hover:rotate-12">
							🥡
						</span>
						<h1 className="text-lg font-bold tracking-tight text-text-heading">
							냉장고 <span className="text-text-brand">재고관리</span>
						</h1>
					</div>
					<span className="text-xs font-medium mt-0.5 text-muted-foreground ml-8">
						{today}
					</span>
				</Link>

				{/* 2. Center: 데스크탑 네비게이션 */}
				<nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
					<ul className="flex items-center p-1.5 rounded-full bg-nav-bg border border-header-border">
						{navItems.map((item) => {
							const isActive =
								item.href === '/'
									? pathname === '/'
									: pathname.startsWith(item.href);

							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`block px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
                        ${
													isActive
														? 'bg-card text-text-brand shadow-sm ring-1 ring-header-border'
														: 'text-muted-foreground hover:text-text-heading hover:bg-nav-item-hover-bg/50'
												}
                    `}
									>
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* 3. Right: 유틸리티 버튼 */}
				<div className="flex items-center gap-2">
					{/* 테마 토글 */}
					<button
						onClick={toggleTheme}
						className="p-2 rounded-full hover:bg-input-bg transition-colors text-muted-foreground hover:text-text-heading border border-transparent"
						aria-label="테마 변경"
					>
						{mounted ? (
							isDarkMode ? (
								<Moon size={20} />
							) : (
								<Sun size={20} />
							)
						) : (
							<div className="h-5 w-5" />
						)}
					</button>

					{/* 유저 버튼 (링크로 변경) */}
					{mounted && (
						<div className="relative">
							{user ? (
								// 로그인 상태: 마이페이지 링크 (닉네임 + 프로필 이미지)
								<Link
									href="/user"
									className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full hover:bg-input-bg transition-all border border-transparent hover:border-header-border group"
								>
									{/* 닉네임 표시 (이름은 길면 ... 처리, '님'은 항상 보임) */}
									<div className="flex items-center text-sm font-semibold text-text-heading">
										<span className="truncate max-w-[70px] sm:max-w-[100px]">
											{user.user_metadata.full_name || '사용자'}
										</span>
										<span className="whitespace-nowrap">님</span>
									</div>

									{/* 프로필 이미지 */}
									{user.user_metadata.avatar_url ? (
										<img
											src={user.user_metadata.avatar_url}
											alt="Profile"
											className="w-7 h-7 rounded-full object-cover shadow-sm group-hover:shadow"
										/>
									) : (
										<div className="w-7 h-7 rounded-full bg-nav-bg flex items-center justify-center text-text-brand">
											<User size={16} />
										</div>
									)}
								</Link>
							) : (
								// 비로그인 상태: 로그인 버튼
								<Link
									href="/login"
									className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-text-brand text-white text-sm font-semibold hover:bg-text-brand/90 transition-all shadow-sm active:scale-95"
								>
									<LogIn
										size={16}
										strokeWidth={2.5}
									/>
									<span>로그인</span>
								</Link>
							)}
						</div>
					)}

					{/* 모바일 햄버거 메뉴 버튼 */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2 rounded-full hover:bg-input-bg transition-colors text-muted-foreground hover:text-text-heading border border-transparent"
						aria-label="메뉴 열기"
					>
						{isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* 4. 모바일 네비게이션 메뉴 */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-header-border bg-header-bg/95 backdrop-blur-md">
					<ul className="flex flex-col p-4 space-y-2">
						{navItems.map((item) => {
							const isActive =
								item.href === '/'
									? pathname === '/'
									: pathname.startsWith(item.href);

							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all
                      ${
												isActive
													? 'bg-nav-bg text-text-brand shadow-sm ring-1 ring-header-border'
													: 'text-muted-foreground hover:bg-nav-bg hover:text-text-heading'
											}
                    `}
									>
										{item.name}
									</Link>
								</li>
							);
						})}

						<li className="pt-3 mt-1 border-t border-header-border">
							{user ? (
								// 모바일에서도 마이페이지로 이동하는 버튼 제공
								<Link
									href="/user"
									className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-text-heading bg-input-bg/50 hover:bg-input-bg transition-all"
								>
									<User size={18} />
									마이페이지 ({user.user_metadata.full_name || '사용자'})
								</Link>
							) : (
								<Link
									href="/login"
									className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-text-brand hover:bg-text-brand/90 transition-all shadow-sm"
								>
									<LogIn size={18} />
									로그인
								</Link>
							)}
						</li>
					</ul>
				</div>
			)}
		</header>
	);
}
