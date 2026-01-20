'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Check, LayoutGrid, Palette } from 'lucide-react'; // 아이콘 추가
import { Category } from '../../types';
import { COLOR_PALETTE, DEFAULT_ICONS } from '../constants';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (name: string, icon: string, color: string) => Promise<void>;
	onDelete?: () => void;
	initialData?: Category | null;
}

export default function CategoryFormModal({
	isOpen,
	onClose,
	onSubmit,
	onDelete,
	initialData,
}: Props) {
	const [name, setName] = useState('');
	const [icon, setIcon] = useState('📦');
	const [color, setColor] = useState('gray');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setName(initialData.name);
				setIcon(initialData.icon);
				setColor(initialData.color);
			} else {
				setName('');
				setIcon('📦');
				setColor('gray');
			}
		}
	}, [isOpen, initialData]);

	const handleSubmit = async () => {
		if (!name.trim()) return;
		setIsSubmitting(true);
		await onSubmit(name, icon, color);
		setIsSubmitting(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm animate-in fade-in">
			<div className="w-full max-w-lg rounded-[2rem] bg-card p-0 shadow-2xl border border-card-border overflow-hidden flex flex-col max-h-[90vh]">
				{/* 헤더 */}
				<div className="px-6 py-5 border-b border-card-border flex items-center justify-between bg-input-bg/50">
					<h2 className="text-xl font-bold text-text-heading">
						{initialData ? '카테고리 수정' : '새 카테고리 추가'}
					</h2>
					<button
						onClick={onClose}
						className="rounded-full p-2 text-muted-foreground hover:bg-neutral hover:text-foreground transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* 스크롤 가능한 본문 */}
				<div className="p-6 overflow-y-auto custom-scrollbar">
					{/* 1. 미리보기 & 이름 입력 (가로 배치) */}
					<div className="flex gap-4 mb-8">
						{/* 미리보기: 선택한 색상과 아이콘이 즉시 반영됨 */}
						<div className="shrink-0">
							<label className="mb-2 block text-xs font-bold text-muted-foreground text-center">
								미리보기
							</label>
							<div
								className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 transition-all bg-${color}-100 border-${color}-200 text-${color}-700 shadow-sm`}
							>
								<span className="text-4xl drop-shadow-sm">{icon}</span>
							</div>
						</div>

						{/* 이름 입력 */}
						<div className="flex-1">
							<label className="mb-2 block text-xs font-bold text-muted-foreground">
								카테고리 이름
							</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full h-[5rem] rounded-2xl border border-input-border bg-input-bg px-4 text-lg font-bold text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
								placeholder="예: 과일, 야채..."
							/>
						</div>
					</div>

					<div className="space-y-8">
						{/* 2. 색상 선택 (Grid) */}
						<div>
							<div className="flex items-center gap-2 mb-3">
								<Palette
									size={16}
									className="text-muted-foreground"
								/>
								<label className="text-sm font-bold text-muted-foreground">
									색상 테마
								</label>
							</div>

							<div className="grid grid-cols-9 gap-2 p-1">
								{COLOR_PALETTE.map((pal) => (
									<button
										key={pal.key}
										onClick={() => setColor(pal.key)}
										className={`group relative aspect-square w-full rounded-full transition-all hover:scale-110 ${pal.class} ${
											color === pal.key
												? 'ring-2 ring-offset-2 ring-offset-card ring-muted-foreground scale-110 shadow-md'
												: 'opacity-70 hover:opacity-100'
										}`}
									>
										{color === pal.key && (
											<span className="absolute inset-0 flex items-center justify-center text-white/90">
												<Check
													size={14}
													strokeWidth={3}
												/>
											</span>
										)}
									</button>
								))}
							</div>
						</div>

						{/* 3. 아이콘 선택 (Grid + Scroll) */}
						<div>
							<div className="flex items-center gap-2 mb-3">
								<LayoutGrid
									size={16}
									className="text-muted-foreground"
								/>
								<label className="text-sm font-bold text-muted-foreground">
									아이콘 선택
								</label>
							</div>

							<div className="rounded-2xl border border-input-border bg-input-bg/30 p-4">
								<div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
									{DEFAULT_ICONS.map((emoji) => (
										<button
											key={emoji}
											onClick={() => setIcon(emoji)}
											className={`aspect-square flex items-center justify-center rounded-xl text-2xl transition-all ${
												icon === emoji
													? 'bg-card shadow-md scale-110 ring-2 ring-primary'
													: 'hover:bg-card/50 hover:scale-110'
											}`}
										>
											{emoji}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 하단 버튼 */}
				<div className="p-6 border-t border-card-border bg-card flex gap-3">
					{initialData && onDelete && (
						<button
							onClick={onDelete}
							className="flex items-center justify-center rounded-xl bg-danger/10 px-5 py-3 font-bold text-danger transition-colors hover:bg-danger hover:text-danger-foreground"
						>
							<Trash2 size={20} />
						</button>
					)}
					<button
						onClick={handleSubmit}
						disabled={!name.trim() || isSubmitting}
						className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
					>
						<Check size={20} />
						{initialData ? '수정 완료' : '추가하기'}
					</button>
				</div>
			</div>
		</div>
	);
}
