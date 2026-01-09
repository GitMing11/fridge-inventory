'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, FolderOpen } from 'lucide-react';
import ActionButton from '../components/ui/ActionButton';

interface Category {
	id: number;
	name: string;
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState('');

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const res = await fetch('/api/categories');
		if (res.ok) {
			const data = await res.json();
			setCategories(data);
		}
	};

	const handleAdd = async () => {
		if (!newCategoryName.trim()) return;
		const res = await fetch('/api/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: newCategoryName }),
		});
		if (res.ok) {
			setNewCategoryName('');
			fetchCategories();
		} else {
			alert('추가 실패');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('정말 삭제하시겠습니까?')) return;

		const res = await fetch(`/api/categories/${id}`, {
			method: 'DELETE',
		});

		if (res.ok) {
			fetchCategories();
		} else {
			const errorData = await res.json();
			alert(errorData.error || '삭제 실패');
		}
	};

	const startEdit = (category: Category) => {
		setEditingId(category.id);
		setEditName(category.name);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditName('');
	};

	const handleUpdate = async (id: number) => {
		if (!editName.trim()) return;
		const res = await fetch(`/api/categories/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: editName }),
		});
		if (res.ok) {
			setEditingId(null);
			fetchCategories();
		} else {
			alert('수정 실패');
		}
	};

	const inputClass =
		'w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-sm font-medium text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50';

	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
				{/* 헤더 섹션 */}
				<div className="mb-10 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info text-info-foreground">
							<FolderOpen size={32} />
						</div>
					</div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						카테고리 관리
					</h1>
					<p className="mt-2 text-muted-foreground">
						재료를 분류할 카테고리를 추가하고 관리하세요.
					</p>
				</div>

				{/* 추가 폼 영역 */}
				<div className="mb-8 rounded-3xl border border-card-border bg-card p-6 shadow-sm">
					<div className="flex gap-3">
						<input
							type="text"
							placeholder="새 카테고리 이름 (예: 채소, 고기)"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							className={inputClass}
							onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
						/>
						<button
							onClick={handleAdd}
							disabled={!newCategoryName.trim()}
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

				{/* 목록 영역 */}
				<div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm">
					<ul className="divide-y divide-card-border">
						{categories.map((cat) => (
							<li
								key={cat.id}
								className="group flex items-center justify-between bg-card px-6 py-4 transition-colors hover:bg-input-bg/50"
							>
								{editingId === cat.id ? (
									// 수정 모드
									<div className="flex w-full items-center gap-3 animate-in fade-in duration-200">
										<input
											type="text"
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											className={`${inputClass} py-2`}
											autoFocus
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleUpdate(cat.id);
												if (e.key === 'Escape') cancelEdit();
											}}
										/>
										<div className="flex gap-2">
											<ActionButton
												onClick={() => handleUpdate(cat.id)}
												variant="success"
												title="저장"
											>
												<Check size={18} />
											</ActionButton>
											<ActionButton
												onClick={cancelEdit}
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
											{cat.name}
										</span>
										<div className="flex gap-2">
											<ActionButton
												onClick={() => startEdit(cat)}
												variant="neutral"
												title="수정"
											>
												<Edit2 size={16} />
											</ActionButton>
											<ActionButton
												onClick={() => handleDelete(cat.id)}
												variant="danger"
												title="삭제"
											>
												<Trash2 size={16} />
											</ActionButton>
										</div>
									</>
								)}
							</li>
						))}
						{categories.length === 0 && (
							<li className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-input-bg">
									<FolderOpen
										size={24}
										className="opacity-50"
									/>
								</div>
								<p>등록된 카테고리가 없습니다.</p>
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
