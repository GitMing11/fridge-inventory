// app/components/ui/FormComponents.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

// 공통 스타일
const inputClassName =
	'w-full rounded-2xl border border-input-border bg-input-bg px-4 py-3.5 text-sm font-medium text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary/50';

interface LabelProps {
	icon?: React.ReactNode;
	text: string;
}

export function FormLabel({ icon, text }: LabelProps) {
	return (
		<label className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground mb-3">
			{icon}
			{text}
		</label>
	);
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput(props: InputProps) {
	return (
		<input
			className={inputClassName}
			{...props}
		/>
	);
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	options: { value: string | number; label: string }[];
	placeholder?: string;
}

export function FormSelect({ options, placeholder, ...props }: SelectProps) {
	return (
		<div className="relative flex-1">
			<select
				className={`${inputClassName} appearance-none cursor-pointer`}
				{...props}
			>
				{placeholder && <option value={0}>{placeholder}</option>}
				{options.map((opt) => (
					<option
						key={opt.value}
						value={opt.value}
					>
						{opt.label}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
				<ChevronDown className="h-3 w-3" />
			</div>
		</div>
	);
}
