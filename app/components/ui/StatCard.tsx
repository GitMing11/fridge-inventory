import React from 'react';

interface StatCardProps {
	title: string;
	count: number;
	icon: React.ReactNode;
	theme: 'info' | 'warning' | 'danger';
}

export default function StatCard({ title, count, icon, theme }: StatCardProps) {
	const themeStyles = {
		info: {
			text: 'text-info-foreground',
			iconBg: 'bg-info/50 dark:bg-info/20',
			iconColor: 'text-info-foreground',
		},
		warning: {
			text: 'text-warning-foreground',
			iconBg: 'bg-warning/50 dark:bg-warning/20',
			iconColor: 'text-warning-foreground',
		},
		danger: {
			text: 'text-danger-foreground',
			iconBg: 'bg-danger/50 dark:bg-danger/20',
			iconColor: 'text-danger-foreground',
		},
	};

	const style = themeStyles[theme];

	return (
		<div className="group bg-card border border-card-border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
			<div>
				<p className="text-muted-foreground font-medium mb-1">{title}</p>
				<p className={`text-4xl font-bold ${style.text}`}>
					{count}
					<span className="text-lg font-medium text-muted-foreground ml-1">
						개
					</span>
				</p>
			</div>
			<div
				className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${style.iconBg} ${style.iconColor}`}
			>
				{icon}
			</div>
		</div>
	);
}
