import fs from 'fs/promises'
import path from 'path'
import { Redis } from '@upstash/redis'

export interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Session {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: StoredMessage[]
}

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDataDir() {
  try { await fs.access(DATA_DIR) } catch { await fs.mkdir(DATA_DIR, { recursive: true }) }
}

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_KEY!,
  })
}

async function kvGet<T>(key: string): Promise<T | null> {
  return getRedis().get<T>(key)
}

async function kvSet(key: string, value: unknown): Promise<void> {
  await getRedis().set(key, value)
}

const useKV = () => !!process.env.KV_REST_API_URL

export async function loadSessions(userId: string): Promise<Session[]> {
  if (useKV()) {
    const sessions = await kvGet<Session[]>(`sessions:${userId}`)
    if (sessions && sessions.length > 0) return sessions
    // Migrate old conversation format to sessions
    const old = await kvGet<StoredMessage[]>(`conversations:${userId}`)
    if (old && old.length > 0) {
      const firstUser = old.find(m => m.role === 'user')
      const migrated: Session[] = [{
        id: crypto.randomUUID(),
        title: firstUser?.content?.slice(0, 25) || '相談履歴',
        createdAt: old[0]?.timestamp || new Date().toISOString(),
        updatedAt: old[old.length - 1]?.timestamp || new Date().toISOString(),
        messages: old,
      }]
      await saveSessions(userId, migrated)
      return migrated
    }
    return []
  }
  await ensureDataDir()
  try {
    const data = await fs.readFile(path.join(DATA_DIR, `sessions_${userId}.json`), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveSessions(userId: string, sessions: Session[]): Promise<void> {
  const trimmed = sessions.slice(-20).map(s => ({
    ...s,
    messages: s.messages.slice(-100),
  }))
  if (useKV()) {
    await kvSet(`sessions:${userId}`, trimmed)
    return
  }
  await ensureDataDir()
  await fs.writeFile(path.join(DATA_DIR, `sessions_${userId}.json`), JSON.stringify(trimmed, null, 2))
}

// Legacy compat used by conversations/route.ts
export async function loadConversation(userId: string): Promise<StoredMessage[]> {
  const sessions = await loadSessions(userId)
  if (sessions.length === 0) return []
  return sessions[sessions.length - 1].messages
}

export async function saveConversation(userId: string, messages: StoredMessage[]): Promise<void> {
  const sessions = await loadSessions(userId)
  if (sessions.length === 0) {
    const firstUser = messages.find(m => m.role === 'user')
    await saveSessions(userId, [{
      id: crypto.randomUUID(),
      title: firstUser?.content?.slice(0, 25) || '新しい相談',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages,
    }])
  } else {
    const last = { ...sessions[sessions.length - 1], messages, updatedAt: new Date().toISOString() }
    await saveSessions(userId, [...sessions.slice(0, -1), last])
  }
}
