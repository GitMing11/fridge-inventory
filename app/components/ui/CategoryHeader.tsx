import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function CategoryHeader() {
	return (
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
	);
}
