'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
	const pathname = usePathname();

	const getLinkClassName = (path: string) => {
		const isActive = pathname === path;

		const baseStyle =
			'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200';

		// 활성 상태: 진한 배경에 흰색 글
		const activeStyle = 'bg-gray-900 text-white shadow-md transform scale-105';

		// 비활성 상태: 회색 글씨, 호버 시 연한 배경
		const inactiveStyle = 'text-gray-500 hover:text-gray-900 hover:bg-gray-100';

		return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				{/* 왼쪽: 로고/앱 이름 */}
				<div className="flex items-center">
					<Link
						href="/"
						className="text-lg font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity"
					>
						🥡 냉장고 <span className="text-blue-600">재고관리</span>
					</Link>
				</div>

				{/* 오른쪽: 네비게이션 메뉴 */}
				<nav className="flex items-center gap-1">
					<Link
						href="/"
						className={getLinkClassName('/')}
					>
						홈
					</Link>
					<Link
						href="/history"
						className={getLinkClassName('/history')}
					>
						기록
					</Link>
					<Link
						href="/categories"
						className={getLinkClassName('/categories')}
					>
						카테고리
					</Link>
				</nav>
			</div>
		</header>
	);
}
