import React from 'react';

// 버튼의 스타일 종류 정의
type ActionButtonVariant =
	| 'primary'
	| 'success'
	| 'danger'
	| 'info'
	| 'neutral'
	| 'ghost';

interface ActionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ActionButtonVariant;
	children: React.ReactNode;
}

export default function ActionButton({
	onClick,
	className = '',
	variant = 'neutral',
	children,
	title,
	...props
}: ActionButtonProps) {
	// variant에 따른 색상 클래스 매핑
	const variantStyles: Record<ActionButtonVariant, string> = {
		primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
		success: 'bg-success text-success-foreground hover:opacity-80',
		danger: 'bg-danger text-danger-foreground hover:opacity-80',
		info: 'bg-info text-info-foreground hover:opacity-80',
		neutral:
			'bg-muted/15 text-muted-foreground hover:bg-muted/25 hover:text-foreground',
		ghost: 'hover:bg-muted/10 text-muted-foreground hover:text-foreground',
	};

	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				if (onClick) onClick(e);
			}}
			title={title}
			className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
