import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { loadSessions, saveSessions } from '@/lib/conversations'
import type { StoredMessage } from '@/lib/conversations'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  const sessionId = request.nextUrl.searchParams.get('sessionId')
  const sessions = await loadSessions(payload.userId)

  let raw: StoredMessage[] = []
  if (sessionId) {
    raw = sessions.find(s => s.id === sessionId)?.messages || []
  } else if (sessions.length > 0) {
    raw = sessions[sessions.length - 1].messages
  }

  const messages = raw.filter(
    m => m.content && m.content.trim() !== '' && !m.content.startsWith('エラー:') && !m.content.startsWith('ネットワークエラー')
  ).slice(-20)
  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  const body = await request.json() as { messages: StoredMessage[]; sessionId?: string; title?: string }
  const sessions = await loadSessions(payload.userId)

  if (body.sessionId) {
    const idx = sessions.findIndex(s => s.id === body.sessionId)
    if (idx >= 0) {
      sessions[idx] = {
        ...sessions[idx],
        messages: body.messages,
        updatedAt: new Date().toISOString(),
        ...(body.title ? { title: body.title } : {}),
      }
    } else {
      const firstUser = body.messages.find(m => m.role === 'user')
      sessions.push({
        id: body.sessionId,
        title: body.title || firstUser?.content?.slice(0, 25) || '新しい相談',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: body.messages,
      })
    }
  } else {
    if (sessions.length === 0) {
      const firstUser = body.messages.find(m => m.role === 'user')
      sessions.push({
        id: crypto.randomUUID(),
        title: firstUser?.content?.slice(0, 25) || '新しい相談',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: body.messages,
      })
    } else {
      sessions[sessions.length - 1] = {
        ...sessions[sessions.length - 1],
        messages: body.messages,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  await saveSessions(payload.userId, sessions)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })

  let sessionId: string | undefined
  try {
    const body = await request.json()
    sessionId = body?.sessionId
  } catch {}

  const sessions = await loadSessions(payload.userId)
  if (sessionId) {
    await saveSessions(payload.userId, sessions.filter(s => s.id !== sessionId))
  } else {
    await saveSessions(payload.userId, [])
  }
  return NextResponse.json({ ok: true })
}
