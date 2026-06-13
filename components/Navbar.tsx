'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-dark"
      style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              心
            </div>
            <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
              MBTI 心理機能
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/">ホーム</NavLink>
            <NavLink href="/types">16タイプ</NavLink>
            <NavLink href="/test">診断テスト</NavLink>
            <NavLink href="/guide">使い方</NavLink>
            {user && <NavLink href="/consultation">AI相談</NavLink>}
            {user && <NavLink href="/dashboard">ダッシュボード</NavLink>}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 rounded-lg bg-indigo-900 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm">{user.username}</span>
                  {user.mbtiType && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      {user.mbtiType}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-gray-600 hover:border-gray-400 transition-all"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg border border-gray-600 hover:border-indigo-400 transition-all"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="text-white text-sm px-4 py-2 rounded-lg transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  新規登録
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-900/30 space-y-3">
            <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>ホーム</MobileNavLink>
            <MobileNavLink href="/types" onClick={() => setMenuOpen(false)}>16タイプ</MobileNavLink>
            <MobileNavLink href="/test" onClick={() => setMenuOpen(false)}>診断テスト</MobileNavLink>
            <MobileNavLink href="/guide" onClick={() => setMenuOpen(false)}>使い方</MobileNavLink>
            {user && (
              <>
                <MobileNavLink href="/consultation" onClick={() => setMenuOpen(false)}>AI相談</MobileNavLink>
                <MobileNavLink href="/dashboard" onClick={() => setMenuOpen(false)}>ダッシュボード</MobileNavLink>
              </>
            )}
            <MobileNavLink href="/contact" onClick={() => setMenuOpen(false)}>お問い合わせ</MobileNavLink>
            <div className="pt-3 border-t border-indigo-900/30 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm">{user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="text-left text-gray-400 hover:text-white text-sm px-2 py-1"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 text-sm px-2 py-1" onClick={() => setMenuOpen(false)}>
                    ログイン
                  </Link>
                  <Link href="/register" className="text-indigo-400 text-sm px-2 py-1" onClick={() => setMenuOpen(false)}>
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-400 hover:text-white text-sm font-medium transition-colors hover:text-indigo-300"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="block text-gray-400 hover:text-white text-sm font-medium px-2 py-1 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
