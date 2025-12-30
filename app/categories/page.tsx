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

	// 공통 스타일 정의 (홈/기록 페이지와 통일)
	const containerStyle: React.CSSProperties = {
		maxWidth: 1000,
		margin: '2rem auto',
		padding: '2.5rem',
		backgroundColor: '#ffffff',
		borderRadius: '24px',
		border: '1px solid #f0f0f0',
		boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		color: '#333',
	};

	const titleStyle: React.CSSProperties = {
		textAlign: 'center',
		marginBottom: '2rem',
		color: '#222',
		fontWeight: 600,
		fontSize: '1.75rem',
	};

	const cardStyle: React.CSSProperties = {
		backgroundColor: '#fff',
		borderRadius: '12px',
		padding: '1.5rem',
		border: '1px solid #eee',
		boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
		marginBottom: '1.5rem',
	};

	const inputStyle: React.CSSProperties = {
		padding: '0.7rem 1rem',
		fontSize: '0.95rem',
		border: '1px solid #ddd',
		borderRadius: '8px',
		outline: 'none',
		width: '100%',
		boxSizing: 'border-box',
		transition: 'border-color 0.2s',
	};

	const buttonBaseStyle: React.CSSProperties = {
		padding: '0.6rem 1.2rem',
		border: 'none',
		borderRadius: '8px',
		fontWeight: 600,
		cursor: 'pointer',
		fontSize: '0.9rem',
		whiteSpace: 'nowrap',
		transition: 'background-color 0.2s',
	};

	return (
		<div style={containerStyle}>
			<h1 style={titleStyle}>카테고리 관리</h1>

			{/* 추가 폼 영역 */}
			<div style={cardStyle}>
				<div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
					<input
						type="text"
						placeholder="새 카테고리 이름 입력"
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						style={inputStyle}
					/>
					<button
						onClick={handleAdd}
						style={{
							...buttonBaseStyle,
							backgroundColor: '#333',
							color: '#fff',
							padding: '0.7rem 1.5rem',
						}}
					>
						추가
					</button>
				</div>
			</div>

			{/* 목록 영역 */}
			<div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
				<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
					{categories.map((cat, index) => (
						<li
							key={cat.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '1rem 1.5rem',
								borderBottom:
									index === categories.length - 1
										? 'none'
										: '1px solid #f0f0f0',
								backgroundColor: '#fff',
							}}
						>
							{editingId === cat.id ? (
								// 수정 모드
								<div
									style={{
										display: 'flex',
										gap: '0.5rem',
										flex: 1,
										width: '100%',
									}}
								>
									<input
										type="text"
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										style={{ ...inputStyle, flex: 1 }}
										autoFocus
									/>
									<button
										onClick={() => handleUpdate(cat.id)}
										style={{
											...buttonBaseStyle,
											backgroundColor: '#2e7d32',
											color: '#fff',
										}}
									>
										저장
									</button>
									<button
										onClick={cancelEdit}
										style={{
											...buttonBaseStyle,
											backgroundColor: '#9e9e9e',
											color: '#fff',
										}}
									>
										취소
									</button>
								</div>
							) : (
								// 보기 모드
								<>
									<span
										style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}
									>
										{cat.name}
									</span>
									<div style={{ display: 'flex', gap: '0.5rem' }}>
										<button
											onClick={() => startEdit(cat)}
											style={{
												...buttonBaseStyle,
												backgroundColor: '#f5f5f5',
												color: '#555',
											}}
										>
											수정
										</button>
										<button
											onClick={() => handleDelete(cat.id)}
											style={{
												...buttonBaseStyle,
												backgroundColor: '#ffebee',
												color: '#c62828',
											}}
										>
											삭제
										</button>
									</div>
								</>
							)}
						</li>
					))}
					{categories.length === 0 && (
						<li style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
							등록된 카테고리가 없습니다.
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
