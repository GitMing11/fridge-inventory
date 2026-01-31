'use server';

import { createClient } from "../../lib/supabase/server";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";

// --- 회원가입 액션 ---
export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { success: false, error: "모든 필드를 입력해주세요." };
  }

  const supabase = await createClient();

  // 1. Supabase Auth에 가입 요청
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name, // 메타데이터에 이름 저장
      },
      // 이메일 확인이 필요하면 리다이렉트 될 URL 지정
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    return { success: false, error: error.message };
  }

  // 2. [중요] 이메일 자동 승인 모드(개발환경 등)라서 세션이 바로 생겼다면,
  //    즉시 Prisma DB에도 유저를 만들어줌
  if (data.session && data.user && data.user.email) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: data.user.email,
            name: name,
            memberships: {
              create: {
                role: "OWNER",
                group: {
                  create: {
                    name: "나의 냉장고",
                    type: "PERSONAL",
                  },
                },
              },
            },
          },
        });
      }
    } catch (dbError) {
      console.error("DB Sync Error:", dbError);
      // DB 생성 실패해도 Supabase 가입은 성공했으므로 넘어감 (로그인 시 다시 시도됨)
    }
  }

  return { 
    success: true, 
    message: data.session 
      ? "가입이 완료되었습니다." 
      : "가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요." 
  };
}

// --- 로그인 액션 ---
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "이메일과 비밀번호를 입력해주세요." };
  }

  const supabase = await createClient();

  // 1. Supabase 로그인
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "로그인 정보가 올바르지 않습니다." };
  }

  // 2. [안전장치] 로그인 성공 시 Prisma에 유저가 없으면 생성 (동기화)
  if (data.user && data.user.email) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: data.user.email },
      });

      if (!dbUser) {
        await prisma.user.create({
          data: {
            email: data.user.email,
            name: data.user.user_metadata.full_name || "사용자",
            memberships: {
              create: {
                role: "OWNER",
                group: {
                  create: {
                    name: "나의 냉장고",
                    type: "PERSONAL",
                  },
                },
              },
            },
          },
        });
      }
    } catch (err) {
      console.error("Login DB Sync Error:", err);
    }
  }

  revalidatePath("/");
  return { success: true };
}

// --- 프로필 수정 액션 ---
export async function updateProfileAction(formData: FormData) {
  const nickname = formData.get("nickname") as string;

  if (!nickname || nickname.trim().length < 2) {
    return { success: false, error: "닉네임은 2글자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    return { success: false, error: "로그인된 사용자가 아닙니다." };
  }

  // 1. Supabase Auth 메타데이터 업데이트 (nickname만 수정)
  const { error: updateError } = await supabase.auth.updateUser({
    data: { 
      nickname: nickname 
    },
  });

  if (updateError) {
    return { success: false, error: "프로필 업데이트 실패: " + updateError.message };
  }

  // 2. Prisma DB 업데이트 (nickname 컬럼 수정)
  try {
    await prisma.user.update({
      where: { email: user.email },
      data: { nickname: nickname },
    });
  } catch (err) {
    console.error("Profile DB Sync Error:", err);
  }

  revalidatePath("/user");
  return { success: true };
}

// --- 회원 탈퇴 액션 ---
export async function deleteAccountAction() {
  const supabase = await createClient();
  
  // 1. 현재 로그인된 유저 확인
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: "로그인된 사용자가 아닙니다." };
  }

  try {
    // 2. Prisma DB에서 유저 데이터 삭제
    // (Cascade 설정이 되어 있다면 작성한 글, 그룹 멤버십 등도 같이 삭제됨)
    await prisma.user.delete({
      where: { email: user.email },
    });

    // 3. Supabase Auth에서 계정 삭제 (Service Role Key 필요)
    // 일반 클라이언트로는 자기 자신을 삭제할 권한이 없을 수 있으므로 Admin 권한 사용
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return [] },
            setAll() {}
          }
        }
      );
      
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    } else {
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY 없어서 Auth 계정은 삭제되지 않았습니다.");
    }

    // 4. 로그아웃 처리 (세션 만료)
    await supabase.auth.signOut();

    revalidatePath("/");
    return { success: true };

  } catch (error) {
    console.error("Delete Account Error:", error);
    return { success: false, error: "회원 탈퇴 처리에 실패했습니다." };
  }
}