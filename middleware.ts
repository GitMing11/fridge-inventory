// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 제외 경로 (미들웨어 실행 안 함 = 로그인 없어도 접근 가능):
     * - 정적 파일들 (_next/static, _next/image, favicon.ico)
     * - 인증 관련 API (api/auth, auth)
     * - 로그인(login), 회원가입(signup) 페이지
     * - 이미지 파일들 (.svg, .png 등)
     * - 랜딩 페이지 (/$ : 루트 경로)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth|login|signup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|/$).*)",
  ],
};