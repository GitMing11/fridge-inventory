// app/page.tsx
import Link from 'next/link';
import {
	ArrowRight,
	Refrigerator,
	Bell,
	Users,
	History,
	ChevronRight,
} from 'lucide-react';
import { createClient } from '../../../lib/supabase/server';
import { getRecentGroupsAction } from '../../actions/ingredientActions';

export default async function LandingPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// 로그인한 경우 최근 그룹/재료 데이터 가져오기
	const recentGroups = user ? await getRecentGroupsAction() : { data: [] };

	return (
		<div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
			{/* 1. Hero Section */}
			<section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-8 bg-gradient-to-b from-primary/10 to-transparent">
				<div className="space-y-4 max-w-3xl mx-auto">
					<div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-text-brand mb-4">
						✨ 스마트한 냉장고 관리의 시작
					</div>
					<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-heading">
						냉장고 속 재료, <br className="hidden sm:block" />
						<span className="text-text-brand">더 신선하게</span> 관리하세요
					</h1>
				</div>

				{user ? (
					/* 로그인 시: 최근 활동 냉장고 대시보드 */
					<div className="w-full max-w-4xl mt-12 px-4">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
								<History
									size={20}
									className="text-text-brand"
								/>
								최근 활동 중인 냉장고
							</h2>
							<Link
								href="/main"
								className="text-sm text-text-brand font-medium hover:underline flex items-center gap-1"
							>
								전체 보기 <ChevronRight size={16} />
							</Link>
						</div>

						{/* 가로 스크롤 카드 영역 */}
						<div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
							{recentGroups.data?.map((group) => (
								<div
									key={group.id}
									className="min-w-[300px] bg-card rounded-3xl p-6 border border-header-border shadow-sm snap-start hover:shadow-md transition-all hover:-translate-y-1"
								>
									<div className="flex justify-between items-start mb-4">
										<h3 className="font-bold text-lg text-text-heading truncate pr-2">
											{group.name}
										</h3>
										<span className="text-[10px] font-bold bg-neutral text-neutral-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">
											{group.type === 'PERSONAL' ? 'Personal' : 'Group'}
										</span>
									</div>

									<div className="space-y-3 mb-6 text-left">
										<p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest opacity-70">
											최근 수정 내역
										</p>
										{group.ingredients.length > 0 ? (
											<div className="space-y-2">
												{group.ingredients.map((item) => (
													<div
														key={item.id}
														className="flex justify-between items-center text-sm"
													>
														<span className="text-text-heading flex items-center gap-2">
															<span className="filter grayscale-[0.3]">
																{item.category.icon}
															</span>
															<span className="truncate max-w-[120px]">
																{item.name}
															</span>
														</span>
														<span className="text-muted-foreground font-medium">
															{item.quantity}
															{item.unit}
														</span>
													</div>
												))}
											</div>
										) : (
											<p className="text-sm text-muted py-4 text-center italic">
												등록된 재료가 없습니다.
											</p>
										)}
									</div>

									<Link
										href={`/main?groupId=${group.id}`}
										className="w-full py-3 rounded-xl bg-input-bg text-text-heading text-sm font-bold flex items-center justify-center gap-2 hover:bg-nav-item-hover-bg transition-colors"
									>
										냉장고 열기{' '}
										<ArrowRight
											size={16}
											className="text-text-brand"
										/>
									</Link>
								</div>
							))}
						</div>
					</div>
				) : (
					/* 비로그인 시: 시작하기 안내 */
					<div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
						<Link
							href="/login"
							className="px-8 py-4 rounded-full bg-text-brand text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-text-brand/20 hover:-translate-y-1 flex items-center gap-2"
						>
							무료로 시작하기 <ArrowRight size={20} />
						</Link>
						<Link
							href="#features"
							className="px-8 py-4 rounded-full bg-card border border-header-border text-text-heading font-medium hover:bg-input-bg transition-colors"
						>
							기능 둘러보기
						</Link>
					</div>
				)}
			</section>

			{/* 2. Features Section */}
			<section
				id="features"
				className="py-24 px-4 bg-card/30"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-text-heading mb-4">
							스마트한 주방을 위한 핵심 기능
						</h2>
						<p className="text-muted-foreground">
							단순한 기록을 넘어, 체계적인 식재료 관리를 경험해보세요.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-all">
							<div className="w-12 h-12 bg-info/10 text-info-foreground rounded-2xl flex items-center justify-center mb-6">
								<Refrigerator size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								맞춤형 카테고리 관리
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								육류, 채소, 소스 등 나만의 카테고리를 만들고 아이콘과 컬러로
								직관적으로 분류하여 관리할 수 있습니다.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-all">
							<div className="w-12 h-12 bg-danger/10 text-danger-foreground rounded-2xl flex items-center justify-center mb-6">
								<Bell size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								정확한 유통기한 알림
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								남은 기한을 D-Day 배지로 한눈에 확인하세요. 유통기한이 임박한
								식재료를 우선적으로 소비하도록 도와줍니다.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="bg-background p-8 rounded-3xl border border-header-border shadow-sm hover:shadow-md transition-all">
							<div className="w-12 h-12 bg-success/10 text-success-foreground rounded-2xl flex items-center justify-center mb-6">
								<Users size={24} />
							</div>
							<h3 className="text-xl font-bold text-text-heading mb-2">
								꼼꼼한 활동 기록
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								언제 어떤 재료를 추가하고 소비했는지 히스토리 탭에서 확인하세요.
								우리 집 식습관을 파악하기 좋습니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Footer */}
			<footer className="py-12 border-t border-header-border text-center text-sm text-muted-foreground bg-background">
				<p>© 2026 Fridge Inventory. All rights reserved.</p>
			</footer>
		</div>
	);
}
