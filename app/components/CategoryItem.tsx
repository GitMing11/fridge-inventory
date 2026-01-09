import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import ActionButton from './ui/ActionButton';
import { Category } from '../../types';

interface CategoryItemProps {
	category: Category;
	isEditing: boolean;
	onEditStart: () => void;
	onEditCancel: () => void;
	onUpdate: (id: number, name: string) => Promise<boolean | void>;
	onDelete: (id: number) => void;
}

export default function CategoryItem({
	category,
	isEditing,
	onEditStart,
	onEditCancel,
	onUpdate,
	onDelete,
}: CategoryItemProps) {
	const [editName, setEditName] = useState(category.name);

	// 수정 모드 진입 시 이름 초기화
	useEffect(() => {
		if (isEditing) setEditName(category.name);
	}, [isEditing, category.name]);

	const handleSave = async () => {
		const success = await onUpdate(category.id, editName);
		if (success) onEditCancel();
	};

	return (
		<li className="group flex items-center justify-between bg-card px-6 py-4 transition-colors hover:bg-input-bg/50">
			{isEditing ? (
				// 수정 모드
				<div className="flex w-full items-center gap-3 animate-in fade-in duration-200">
					<input
						type="text"
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-2 text-sm font-medium text-foreground outline-none focus:border-primary"
						autoFocus
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSave();
							if (e.key === 'Escape') onEditCancel();
						}}
					/>
					<div className="flex gap-2">
						<ActionButton
							onClick={handleSave}
							variant="success"
							title="저장"
						>
							<Check size={18} />
						</ActionButton>
						<ActionButton
							onClick={onEditCancel}
							variant="neutral"
							title="취소"
						>
							<X size={18} />
						</ActionButton>
					</div>
				</div>
			) : (
				// 보기 모드
				<>
					<span className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
						{category.name}
					</span>
					<div className="flex gap-2">
						<ActionButton
							onClick={onEditStart}
							variant="neutral"
							title="수정"
						>
							<Edit2 size={16} />
						</ActionButton>
						<ActionButton
							onClick={() => onDelete(category.id)}
							variant="danger"
							title="삭제"
						>
							<Trash2 size={16} />
						</ActionButton>
					</div>
				</>
			)}
		</li>
	);
}
