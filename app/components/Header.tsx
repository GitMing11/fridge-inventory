'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
	const pathname = usePathname();

	const linkStyle = (path: string) => ({
		marginRight: '1rem',
		textDecoration: 'none',
		fontWeight: pathname === path ? '600' : '400',
		color: pathname === path ? '#fff' : '#333', // 선택되면 흰색 글씨
		backgroundColor: pathname === path ? '#333' : 'transparent', // 선택되면 어두운 배경
		padding: '0.5rem 1rem',
		borderRadius: '20px',
		transition: 'all 0.2s ease',
	});

	return (
		<header
			style={{
				padding: '1rem 2rem',
				borderBottom: '1px solid #ddd',
				marginBottom: '2rem',
				backgroundColor: '#fafafa',
				display: 'flex',
				alignItems: 'center',
				fontFamily: 'Arial, sans-serif',
			}}
		>
			<nav>
				<Link
					href="/"
					style={linkStyle('/')}
				>
					홈
				</Link>
				<Link
					href="/history"
					style={linkStyle('/history')}
				>
					기록
				</Link>
				<Link
					href="/categories"
					style={linkStyle('/categories')}
				>
					카테고리
				</Link>
			</nav>
		</header>
	);
}
