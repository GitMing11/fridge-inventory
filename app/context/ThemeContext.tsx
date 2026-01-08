'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
	isDarkMode: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// 초기값은 false (Light Mode)
	const [isDarkMode, setIsDarkMode] = useState(false);

	// 1. 앱이 실행될 때 로컬 스토리지나 시스템 설정 확인 (선택 사항, 여기선 생략 가능하지만 넣으면 좋음)
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			setIsDarkMode(true);
			document.documentElement.classList.add('dark');
		}
	}, []);

	// 2. 테마 변경 함수
	const toggleTheme = () => {
		setIsDarkMode((prev) => {
			const newMode = !prev;
			if (newMode) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
			return newMode;
		});
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

// 3. 다른 컴포넌트에서 쉽게 쓰기 위한 커스텀 훅
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
