import React from 'react';

interface Props {
	icon: React.ReactNode;
	label: string;
	value: string;
	highlight?: boolean;
}

export default function InfoCard({
	icon,
	label,
	value,
	highlight = false,
}: Props) {
	return (
		<div
			className={`p-4 rounded-2xl border transition-colors ${
				highlight
					? 'bg-highlight-bg border-highlight-border'
					: 'bg-input-bg/50 border-input-border'
			}`}
		>
			<div
				className={`mb-2 ${
					highlight ? 'text-highlight-label' : 'text-muted-foreground'
				}`}
			>
				{icon}
			</div>
			<p className="text-xs font-medium text-muted-foreground mb-0.5">
				{label}
			</p>
			<p
				className={`font-semibold ${
					highlight ? 'text-highlight-value' : 'text-foreground'
				}`}
			>
				{value}
			</p>
		</div>
	);
}
