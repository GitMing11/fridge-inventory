// app/auth/callback/route.ts
'use server';

import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next 파라미터가 있으면 거기로, 없으면 홈(/)으로 이동
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
      if (!error) {
        // 1. Supabase 인증 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()

      if (user && user.email) {
        try {
          // 2. 우리 DB(Prisma)에 유저가 있는지 확인
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          // 3. 없으면 -> 유저 + '나의 냉장고' 자동 생성
          if (!dbUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.user_metadata.full_name || '사용자',
                image: user.user_metadata.avatar_url,
                // 유저를 만들면서 동시에 '나의 냉장고(그룹)'도 생성하고 멤버로 가입시킴
                memberships: {
                  create: {
                    role: 'OWNER',
                    group: {
                      create: {
                        name: '나의 냉장고',
                        type: 'PERSONAL'
                      }
                    }
                  }
                }
              }
            })
            console.log(`✨ 새 유저 생성 완료: ${user.email}`)
          }
        } catch (err) {
          console.error('DB 유저 동기화 실패:', err)
          // 에러가 나도 일단 로그인은 진행시키거나, 에러 페이지로 보낼 수 있음
        }
      }
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