import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, updateUserMbtiType, sanitizeUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })
    }

    const body = await request.json()
    const { mbtiType } = body

    if (!mbtiType) {
      return NextResponse.json({ error: 'MBTIタイプが必要です' }, { status: 400 })
    }

    const updatedUser = await updateUserMbtiType(payload.userId, mbtiType)
    if (!updatedUser) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    return NextResponse.json({
      user: sanitizeUser(updatedUser),
      message: 'MBTIタイプを保存しました',
    })
  } catch {
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 })
  }
}
