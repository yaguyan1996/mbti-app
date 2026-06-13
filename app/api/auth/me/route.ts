import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUser, sanitizeUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })
    }

    const user = await getUser(payload.userId)
    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    return NextResponse.json({ user: sanitizeUser(user) })
  } catch {
    return NextResponse.json({ error: '認証エラーが発生しました' }, { status: 500 })
  }
}
