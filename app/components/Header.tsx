'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
	const pathname = usePathname();
	const { isDarkMode, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
		<header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80">
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
						<h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
							냉장고{' '}
							<span className="text-sky-500 dark:text-sky-400">재고관리</span>
						</h1>
					</div>
					<span className="text-xs font-medium mt-0.5 text-slate-500 ml-8 dark:text-slate-400">
						{today}
					</span>
				</Link>

				{/* 2. Center: 네비게이션 (Segmented Control Style) */}
				<nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
					<ul className="flex items-center p-1.5 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
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
														? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-sky-400 dark:ring-slate-700' // 활성: 흰색 알약이 떠있는 느낌 (가장 직관적)
														: 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50' // 비활성
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
					<button
						onClick={toggleTheme}
						className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
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
				</div>
			</div>
		</header>
	);
}
