'use client';

import React, { useState, useEffect } from 'react';

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

	// 공통 입력창 스타일 클래스
	const inputClass =
		'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100';

	return (
		<div className="mx-auto my-8 max-w-3xl rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
			<h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
				카테고리 관리
			</h1>

			{/* 추가 폼 영역 */}
			<div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex gap-3">
					<input
						type="text"
						placeholder="새 카테고리 이름 입력"
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						className={inputClass}
						onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
					/>
					<button
						onClick={handleAdd}
						className="whitespace-nowrap rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
					>
						추가
					</button>
				</div>
			</div>

			{/* 목록 영역 */}
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<ul className="divide-y divide-gray-100">
					{categories.map((cat) => (
						<li
							key={cat.id}
							className="group flex items-center justify-between bg-white px-6 py-4 transition-colors hover:bg-gray-50"
						>
							{editingId === cat.id ? (
								// 수정 모드
								<div className="flex w-full items-center gap-2">
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
										<button
											onClick={() => handleUpdate(cat.id)}
											className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
										>
											저장
										</button>
										<button
											onClick={cancelEdit}
											className="rounded-lg bg-gray-400 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-500"
										>
											취소
										</button>
									</div>
								</div>
							) : (
								// 보기 모드
								<>
									<span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
										{cat.name}
									</span>
									<div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											onClick={() => startEdit(cat)}
											className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
										>
											수정
										</button>
										<button
											onClick={() => handleDelete(cat.id)}
											className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
										>
											삭제
										</button>
									</div>
								</>
							)}
						</li>
					))}
					{categories.length === 0 && (
						<li className="py-12 text-center text-gray-400">
							등록된 카테고리가 없습니다.
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
