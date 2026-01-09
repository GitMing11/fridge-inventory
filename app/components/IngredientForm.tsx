'use client';

import React from 'react';
import { Category, Ingredient } from '../../types';
import { X, Plus, Calendar, Package, Tag, ShoppingBag } from 'lucide-react';
import { useIngredientForm } from '../hooks/useIngredientForm';
import { FormInput, FormLabel, FormSelect } from './ui/FormComponents';

interface Props {
	categories: Category[];
	setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	onAdd: (newItem: Ingredient) => void;
	onUpdate?: (updatedItem: Ingredient) => void;
	initialData?: Ingredient | null;
	onClose: () => void;
}

export default function IngredientForm(props: Props) {
	const { categories, onClose, initialData } = props;
	const isEditMode = !!initialData;

	const {
		newIngredient,
		newCategory,
		setNewCategory,
		handleChange,
		handleAddCategory,
		handleSubmit,
	} = useIngredientForm(props);

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-sm transition-opacity p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-full max-w-[500px] overflow-hidden rounded-3xl bg-card border border-card-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between border-b border-card-border px-8 py-6 bg-card/50 backdrop-blur-md">
					<div>
						<h2 className="text-xl font-bold text-foreground">
							{isEditMode ? '재료 수정하기' : '새로운 재료 추가'}
						</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							냉장고에 보관할 재료의 정보를 입력해주세요.
						</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-input-bg hover:text-foreground"
					>
						<X size={20} />
					</button>
				</div>

				{/* 폼 영역 */}
				<div className="flex flex-col gap-6 p-8">
					{/* 1. 카테고리 */}
					<div>
						<FormLabel
							icon={<Tag size={16} />}
							text="카테고리"
						/>
						<div className="flex flex-col gap-3 sm:flex-row">
							<FormSelect
								value={newIngredient.categoryId}
								onChange={(e) =>
									handleChange('categoryId', Number(e.target.value))
								}
								options={categories.map((c) => ({
									value: c.id,
									label: c.name,
								}))}
								placeholder="카테고리 선택"
							/>
							<div className="flex flex-1 gap-2">
								<FormInput
									placeholder="새 카테고리"
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
								/>
								<button
									onClick={handleAddCategory}
									disabled={!newCategory.trim()}
									className="flex w-12 items-center justify-center rounded-2xl bg-input-bg border border-input-border text-muted-foreground transition-colors hover:bg-card-border hover:text-foreground disabled:opacity-50"
								>
									<Plus size={20} />
								</button>
							</div>
						</div>
					</div>

					{/* 2. 이름 */}
					<div>
						<FormLabel
							icon={<Package size={16} />}
							text="재료 이름"
						/>
						<FormInput
							placeholder="예: 양파, 우유, 삼겹살"
							value={newIngredient.name}
							onChange={(e) => handleChange('name', e.target.value)}
						/>
					</div>

					{/* 3. 수량 및 단위 */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<FormLabel
								icon={<ShoppingBag size={16} />}
								text="수량"
							/>
							<FormInput
								type="number"
								placeholder="0"
								value={newIngredient.quantity || ''}
								onChange={(e) =>
									handleChange('quantity', Number(e.target.value))
								}
							/>
						</div>
						<div>
							<FormLabel text="단위" />
							<FormInput
								placeholder="개, g, ml"
								value={newIngredient.unit}
								onChange={(e) => handleChange('unit', e.target.value)}
							/>
						</div>
					</div>

					{/* 4. 날짜 정보 */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<FormLabel
								icon={<Calendar size={16} />}
								text="유통기한"
							/>
							<FormInput
								type="date"
								value={newIngredient.expiration}
								onChange={(e) => handleChange('expiration', e.target.value)}
								style={{ cursor: 'pointer' }}
							/>
						</div>
						<div>
							<FormLabel text="구매일" />
							<FormInput
								type="date"
								value={newIngredient.purchasedAt}
								onChange={(e) => handleChange('purchasedAt', e.target.value)}
								style={{ cursor: 'pointer' }}
							/>
						</div>
					</div>

					{/* 완료 버튼 */}
					<button
						onClick={handleSubmit}
						className="mt-4 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98]"
					>
						{isEditMode ? '변경사항 저장하기' : '냉장고에 채우기'}
					</button>
				</div>
			</div>
		</div>
	);
}
