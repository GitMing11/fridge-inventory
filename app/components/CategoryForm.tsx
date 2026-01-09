import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CategoryFormProps {
	onAdd: (name: string) => Promise<boolean | void>;
}

export default function CategoryForm({ onAdd }: CategoryFormProps) {
	const [name, setName] = useState('');

	const handleSubmit = async () => {
		const success = await onAdd(name);
		if (success) setName(''); // 성공 시 입력창 초기화
	};

	return (
		<div className="mb-8 rounded-3xl border border-card-border bg-card p-6 shadow-sm">
			<div className="flex gap-3">
				<input
					type="text"
					placeholder="새 카테고리 이름 (예: 채소, 고기)"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-sm font-medium text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
					onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
				/>
				<button
					onClick={handleSubmit}
					disabled={!name.trim()}
					className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary"
				>
					<Plus
						size={18}
						strokeWidth={3}
					/>
					추가
				</button>
			</div>
		</div>
	);
}
