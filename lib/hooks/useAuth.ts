'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id: string
  username: string
  mbtiType?: string
  createdAt: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch {
      console.error('Logout failed')
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    await fetchUser()
  }

  return { user, loading, logout, refreshUser }
}
