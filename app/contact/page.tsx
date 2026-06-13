'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

const CATEGORIES = ['バグ報告', '機能提案', '質問', 'その他']

export default function ContactPage() {
  const [category, setCategory] = useState('その他')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('メッセージを入力してください')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, username: username.trim() || undefined, message }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || '送信に失敗しました')
      }
    } catch {
      setError('送信に失敗しました。もう一度お試しください')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-3">お問い合わせ</h1>
          <p className="text-gray-400">ご意見・ご要望・バグ報告などをお気軽にどうぞ</p>
        </div>

        {success ? (
          <div
            className="animate-slide-up rounded-2xl p-10 text-center"
            style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">送信完了しました</h2>
            <p className="text-gray-400 mb-2">お問い合わせありがとうございます。</p>
            <p className="text-gray-400">内容を確認の上、対応いたします。</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-slide-up rounded-2xl p-8 space-y-6"
            style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                カテゴリ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-dark"
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#111128', color: 'white' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                お名前・ユーザー名
                <span className="text-gray-500 font-normal ml-2">（任意）</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="例: tanaka_taro"
                className="input-dark"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                メッセージ
                <span className="text-indigo-400 ml-1">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="お問い合わせ内容を入力してください"
                className="input-dark resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {loading ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
