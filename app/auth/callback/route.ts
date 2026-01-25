// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next 파라미터가 있으면 거기로, 없으면 홈(/)으로 이동
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // 로드 밸런서 환경 고려
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // 로컬 개발 환경: origin 그대로 사용
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Vercel 등 배포 환경
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 인증 실패 시 에러 페이지로 이동
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}