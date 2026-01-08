'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
	const pathname = usePathname();
	const { isDarkMode, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태

	useEffect(() => {
		setMounted(true);
	}, []);

	// 페이지 이동 시 모바일 메뉴 닫기
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	// 오늘 날짜 포맷팅
	const today = new Date().toLocaleDateString('ko-KR', {
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	});

	const navItems = [
		{ name: '홈', href: '/' },
		{ name: '기록', href: '/history' },
		{ name: '카테고리', href: '/categories' },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-header-border bg-header-bg/80 backdrop-blur-md transition-colors duration-300">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
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

				{/* 2. Center: 데스크탑 네비게이션 (md 이상에서만 보임) */}
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
														? 'bg-card text-text-brand shadow-sm ring-1 ring-header-border' // 활성
														: 'text-muted-foreground hover:text-text-heading hover:bg-nav-item-hover-bg/50' // 비활성
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

				{/* 3. Right: 유틸리티 버튼 & 모바일 메뉴 토글 */}
				<div className="flex items-center gap-2">
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

					{/* 모바일 햄버거 메뉴 버튼 (md 미만에서만 보임) */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2 rounded-full hover:bg-input-bg transition-colors text-muted-foreground hover:text-text-heading border border-transparent"
						aria-label="메뉴 열기"
					>
						{isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* 4. 모바일 네비게이션 메뉴 (Mobile Drawer) */}
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
					</ul>
				</div>
			)}
		</header>
	);
}
