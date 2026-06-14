import * as bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import fs from 'fs/promises'
import path from 'path'
import { Redis } from '@upstash/redis'

export interface User {
  id: string
  username: string
  passwordHash: string
  mbtiType?: string
  createdAt: string
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mbti-secret-key-change-in-production'
)

// ---- KV helpers (only used in production with KV_REST_API_URL set) ----

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

async function kvSadd(key: string, member: string): Promise<void> {
  await getRedis().sadd(key, member)
}

// ---- file-based storage (local dev) ----

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

async function ensureDataDir() {
  try { await fs.access(DATA_DIR) } catch { await fs.mkdir(DATA_DIR, { recursive: true }) }
}

async function readUsersFile(): Promise<User[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeUsersFile(users: User[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

const useKV = () => !!process.env.KV_REST_API_URL

// ---- public API ----

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function getUser(userId: string): Promise<User | null> {
  if (useKV()) return kvGet<User>(`user:${userId}`)
  const users = await readUsersFile()
  return users.find((u) => u.id === userId) || null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  if (useKV()) {
    const userId = await kvGet<string>(`username:${username}`)
    if (!userId) return null
    return kvGet<User>(`user:${userId}`)
  }
  const users = await readUsersFile()
  return users.find((u) => u.username === username) || null
}

export async function createUser(username: string, password: string): Promise<User> {
  const existing = await getUserByUsername(username)
  if (existing) throw new Error('このユーザー名は既に使用されています')

  const passwordHash = await hashPassword(password)
  const user: User = {
    id: generateId(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  if (useKV()) {
    await kvSet(`user:${user.id}`, user)
    await kvSet(`username:${username}`, user.id)
    await kvSadd('user_ids', user.id)
  } else {
    const users = await readUsersFile()
    users.push(user)
    await writeUsersFile(users)
  }
  return user
}

export async function updateUserMbtiType(userId: string, mbtiType: string): Promise<User | null> {
  if (useKV()) {
    const user = await kvGet<User>(`user:${userId}`)
    if (!user) return null
    user.mbtiType = mbtiType
    await kvSet(`user:${userId}`, user)
    return user
  }
  const users = await readUsersFile()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return null
  users[idx].mbtiType = mbtiType
  await writeUsersFile(users)
  return users[idx]
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash: _, ...rest } = user
  return rest
}
