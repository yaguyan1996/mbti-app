import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { loadConversation, saveConversation } from '@/lib/conversations'
import type { StoredMessage } from '@/lib/conversations'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  const raw = await loadConversation(payload.userId)
  // エラーメッセージと空メッセージを除外して返す
  const messages = raw.filter(
    (m: StoredMessage) => m.content && m.content.trim() !== '' && !m.content.startsWith('エラー:') && !m.content.startsWith('ネットワークエラー')
  ).slice(-20)
  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  const { messages } = await request.json() as { messages: StoredMessage[] }
  await saveConversation(payload.userId, messages)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  await saveConversation(payload.userId, [])
  return NextResponse.json({ ok: true })
}
