// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  // 프록시를 통해 세션을 갱신하고, 로그인 안 된 사용자는 /login으로 튕겨냅니다.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 경로에서 미들웨어가 실행됩니다:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - /api/auth (Auth 콜백 경로 등은 제외해야 무한 루프 방지)
     * - /login, /auth (로그인 관련 페이지 제외)
     * - 이미지 파일들 (.svg, .png 등)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};