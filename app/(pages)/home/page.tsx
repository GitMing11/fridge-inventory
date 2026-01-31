// app/page.tsx
import Link from 'next/link';
import { ArrowRight, Refrigerator, Bell, Users } from 'lucide-react';
import { createClient } from '../../../lib/supabase/server';

export default async function LandingPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
			{/* 1. Hero Section (메인 배너) */}
			<section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center space-y-8 bg-gradient-to-b from-primary/10 to-transparent">
				<div className="space-y-4 max-w-3xl mx-auto">
					<div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-text-brand mb-4">
						✨ 스마트한 냉장고 관리의 시작
					</div>
					<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-heading">
						냉장고 속 재료, <br className="hidden sm:block" />
						<span className="text-text-brand">더 신선하게</span> 관리하세요
					</h1>
					<p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
						유통기한 임박 알림부터 가족과의 공유 냉장고까지.
						<br />
						버려지는 식재료 없이 알뜰한 주방 생활을 도와드립니다.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
					{user ? (
						<Link
							href="/main"
							className="px-8 py-4 rounded-full bg-text-brand text-white font-bold text-lg hover:bg-text-brand/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
						>
							내 냉장고로 이동 <ArrowRight size={20} />
						</Link>
					) : (
						<Link
							href="/login"
							className="px-8 py-4 rounded-full bg-text-brand text-white font-bold text-lg hover:bg-text-brand/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
						>
							무료로 시작하기 <ArrowRight size={20} />
						</Link>
					)}

					{!user && (
						<Link
							href="#features"
							className="px-8 py-4 rounded-full bg-card border border-header-border text-text-heading font-medium hover:bg-input-bg transition-colors"
						>
							기능 둘러보기
						</Link>
					)}
				</div>
			</section>

			{/* 2. Features Section (기능 소개) */}
			<section
				id="features"
				className="py-24 px-4 bg-card/50"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-text-heading mb-4">
							왜 &apos;냉장고 재고관리&apos;인가요?
						</h2>
						<p className="text-muted-foreground">
							복잡한 냉장고 정리, 이제 앱 하나로 해결하세요.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
								<Refrigerator size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								간편한 재고 파악
							</h3>
							<p className="text-muted-foreground text-sm">
								한 눈에 들어오는 리스트로 냉장고에 뭐가 있는지 3초 만에
								확인하세요.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
								<Bell size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								유통기한 알림
							</h3>
							<p className="text-muted-foreground text-sm">
								소중한 식재료가 상해서 버려지지 않도록, 유통기한 임박 시 미리
								알려드려요.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
								<Users size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								가족과 함께 공유
							</h3>
							<p className="text-muted-foreground text-sm">
								냉장고를 그룹으로 공유하세요. 누가 넣었는지, 누가 먹었는지
								기록됩니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Footer */}
			<footer className="py-8 border-t border-header-border text-center text-sm text-muted-foreground">
				<p>© 2026 Fridge Inventory. All rights reserved.</p>
			</footer>
		</div>
	);
}
