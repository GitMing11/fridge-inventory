'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/client';
import { updateProfileAction } from '../../../actions/authActions';
import { MoveLeft, Loader2, Save, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function EditProfilePage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [name, setName] = useState('');
	const [nickname, setNickname] = useState('');
	const [email, setEmail] = useState('');
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const router = useRouter();
	const supabase = createClient();

	// 초기 데이터 로드
	useEffect(() => {
		const init = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.replace('/login');
				return;
			}

			// 프로필 이미지 가져오기 (avatar_url 또는 picture)
			const metaAvatar =
				user.user_metadata.avatar_url || user.user_metadata.picture || null;

			// 이메일 가져오기
			const userEmail =
				user.email ||
				user.user_metadata.email ||
				user.identities?.find((identity) => identity.identity_data?.email)
					?.identity_data?.email ||
				'';

			// 이름 가져오기 (우선순위: 닉네임 > 전체이름 > 이름)
			const metaName =
				user.user_metadata.full_name || user.user_metadata.name || '';
			const metaNickname = user.user_metadata.nickname || '';

			setAvatarUrl(metaAvatar);
			setEmail(userEmail);
			setName(metaName);
			setNickname(metaNickname);
			setLoading(false);
		};
		init();
	}, [router, supabase]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSaving(true);

		const formData = new FormData(e.currentTarget);
		const result = await updateProfileAction(formData);

		if (result.success) {
			alert('프로필이 수정되었습니다.');
			router.push('/user');
			router.refresh();
		} else {
			alert(result.error || '수정에 실패했습니다.');
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-muted-foreground">
				로딩 중...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background px-4 py-8">
			<div className="max-w-md mx-auto space-y-8">
				{/* 헤더 */}
				<div className="flex items-center gap-4">
					<Link
						href="/user"
						className="p-2 -ml-2 rounded-full hover:bg-neutral transition-colors text-muted-foreground hover:text-text-heading"
					>
						<MoveLeft size={24} />
					</Link>
					<h1 className="text-xl font-bold text-text-heading">프로필 수정</h1>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-8"
				>
					{/* 프로필 이미지 영역 */}
					<div className="flex flex-col items-center justify-center gap-4">
						<div className="relative w-28 h-28">
							<div className="w-full h-full rounded-full border-4 border-card bg-neutral flex items-center justify-center overflow-hidden shadow-sm">
								{/* 이미지가 있으면 이미지 표시, 없으면 아이콘 표시 */}
								{avatarUrl ? (
									<Image
										src={avatarUrl}
										alt="Profile"
										width={112}
										height={112}
										className="w-full h-full object-cover"
									/>
								) : (
									<UserIcon
										size={48}
										className="text-muted-foreground"
									/>
								)}
							</div>
						</div>
						<p className="text-xs text-muted-foreground">
							프로필 사진 변경은 준비 중입니다.
						</p>
					</div>

					{/* 입력 필드 영역 */}
					<div className="space-y-5">
						{/* 이메일 (읽기 전용) */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-text-heading">
								이메일
							</label>
							<input
								type="email"
								value={email}
								disabled
								placeholder="이메일 정보 없음"
								className="w-full px-4 py-3 rounded-xl border border-input-border bg-neutral/50 text-muted-foreground cursor-not-allowed focus:outline-none"
							/>
							{email === '' && (
								<p className="text-xs text-amber-500 px-1 mt-1">
									* 소셜 계정에서 이메일 정보를 제공하지 않았습니다.
								</p>
							)}
						</div>

						{/* 이름 (읽기 전용) */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-text-heading">
								이름
							</label>
							<input
								type="text"
								value={name}
								disabled
								className="w-full px-4 py-3 rounded-xl border border-input-border bg-neutral/50 text-muted-foreground cursor-not-allowed focus:outline-none"
							/>
							<p className="text-xs text-muted-foreground px-1">
								가입 시 등록한 이름은 변경할 수 없습니다.
							</p>
						</div>

						{/* 닉네임 (수정 가능) */}
						<div className="space-y-2">
							<label
								htmlFor="nickname"
								className="text-sm font-medium text-text-heading"
							>
								닉네임
							</label>
							<input
								id="nickname"
								name="nickname"
								type="text"
								required
								minLength={2}
								defaultValue={nickname}
								placeholder="사용할 닉네임을 입력하세요"
								className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg focus:border-text-brand focus:ring-2 focus:ring-text-brand/20 outline-none transition-all"
							/>
						</div>
					</div>

					{/* 저장 버튼 */}
					<button
						type="submit"
						disabled={saving}
						className="w-full py-3.5 px-4 bg-text-brand text-white rounded-xl font-bold shadow-md hover:bg-text-brand/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
					>
						{saving ? (
							<>
								<Loader2 className="animate-spin h-5 w-5" />
								저장 중...
							</>
						) : (
							<>
								<Save size={18} />
								저장하기
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
