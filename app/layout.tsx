// app/layout.tsx

import Header from './components/Header';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';

export const metadata = {
	title: '냉장고 재고 관리',
	description: '냉장고 재고 관리 앱',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body>
				<ThemeProvider>
					<Header />
					<main>{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
