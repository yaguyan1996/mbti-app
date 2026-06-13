import fs from 'fs/promises'
import path from 'path'

export interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDataDir() {
  try { await fs.access(DATA_DIR) } catch { await fs.mkdir(DATA_DIR, { recursive: true }) }
}

function filePath(userId: string) {
  return path.join(DATA_DIR, `conversations_${userId}.json`)
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { kv } = await import('@vercel/kv')
  return kv.get<T>(key)
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(key, value)
}

const useKV = () => !!process.env.KV_REST_API_URL

export async function loadConversation(userId: string): Promise<StoredMessage[]> {
  if (useKV()) {
    return (await kvGet<StoredMessage[]>(`conversations:${userId}`)) || []
  }
  await ensureDataDir()
  try {
    const data = await fs.readFile(filePath(userId), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveConversation(userId: string, messages: StoredMessage[]): Promise<void> {
  // Keep last 100 messages to prevent unbounded growth
  const trimmed = messages.slice(-100)
  if (useKV()) {
    await kvSet(`conversations:${userId}`, trimmed)
    return
  }
  await ensureDataDir()
  await fs.writeFile(filePath(userId), JSON.stringify(trimmed, null, 2), 'utf-8')
}
