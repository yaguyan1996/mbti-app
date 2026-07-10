import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { loadSessions } from '@/lib/conversations'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  const sessions = await loadSessions(payload.userId)
  const meta = sessions
    .map(s => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages.filter(m => m.role === 'user').length,
    }))
    .reverse()
  return NextResponse.json({ sessions: meta })
}
