'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    marginRight: '1rem',
    textDecoration: pathname === path ? 'underline' : 'none',
    fontWeight: pathname === path ? '600' : '400',
    color: '#333',
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
        <Link href="/" style={linkStyle('/')}>홈</Link>
        <Link href="/history" style={linkStyle('/history')}>기록</Link>
      </nav>
    </header>
  );
}
