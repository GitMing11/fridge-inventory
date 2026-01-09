import React from 'react';

interface Props {
	dDay: number;
	className?: string;
}

export default function DDayBadge({ dDay, className = '' }: Props) {
	let text = '';
	let styleClass = '';

	if (dDay === 0) {
		text = 'D-Day';
		styleClass = 'bg-danger text-danger-foreground ring-danger-foreground/20';
	} else if (dDay > 0) {
		text = `D-${dDay}`;
		// 3일 이하 임박: 주황, 그 외: 초록
		styleClass =
			dDay <= 3
				? 'bg-warning text-warning-foreground ring-warning-foreground/20'
				: 'bg-success text-success-foreground ring-success-foreground/20';
	} else {
		text = `만료 (D+${Math.abs(dDay)})`;
		styleClass =
			'bg-neutral text-neutral-foreground ring-neutral-foreground/20';
	}

	return (
		<span
			className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${styleClass} ${className}`}
		>
			{text}
		</span>
	);
}
