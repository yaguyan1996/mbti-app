'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { testQuestions, calculateMbtiType, mbtiTypes } from '@/lib/mbti-data'
import type { MbtiType } from '@/lib/mbti-data'

type Phase = 'intro' | 'test' | 'result'

export default function TestPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({})
  const [resultType, setResultType] = useState<MbtiType | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const question = testQuestions[currentQ]
  const progress = ((currentQ) / testQuestions.length) * 100
  const totalQuestions = testQuestions.length

  const handleAnswer = (value: 'A' | 'B') => {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200)
    } else {
      // Calculate result
      const type = calculateMbtiType(newAnswers)
      setResultType(type)
      setPhase('result')
    }
  }

  const handleSave = async () => {
    if (!resultType) return
    setSaving(true)
    try {
      const res = await fetch('/api/mbti/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbtiType: resultType }),
      })
      if (res.ok) {
        setSaved(true)
      }
    } catch {
      console.error('Failed to save MBTI type')
    } finally {
      setSaving(false)
    }
  }

  const restart = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setResultType(null)
    setSaved(false)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-2xl w-full text-center animate-fade-in">
            <div className="text-6xl mb-6">🧬</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              MBTI 診断テスト
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              20問の質問に直感的に答えてください。
              正直に、深く考えすぎずに答えることで、より正確な結果が得られます。
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              {[
                { icon: '📝', label: '20問の質問' },
                { icon: '⏱', label: '約5分' },
                { icon: '🎯', label: '4軸を分析' },
                { icon: '🧠', label: '認知機能を特定' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-gray-300 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPhase('test')}
              className="px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              テストを始める
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (phase === 'result' && resultType) {
    const typeData = mbtiTypes[resultType]
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-2">診断結果</h1>
              <p className="text-gray-400">あなたのMBTIタイプが判明しました</p>
            </div>

            {/* Result Card */}
            <div
              className="p-8 rounded-2xl text-center mb-6"
              style={{
                background: `${typeData.color}10`,
                border: `2px solid ${typeData.color}40`,
              }}
            >
              <div
                className="text-7xl font-bold mb-3"
                style={{ color: typeData.color }}
              >
                {resultType}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{typeData.name}</div>
              <div className="text-gray-400 mb-2">{typeData.nickname}</div>
              <div
                className="inline-block text-sm px-3 py-1 rounded-full"
                style={{ background: `${typeData.color}20`, color: typeData.color }}
              >
                {typeData.groupJa}
              </div>
              <p className="text-gray-300 mt-6 leading-relaxed">{typeData.description}</p>
            </div>

            {/* Function Stack */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4 text-center">あなたの認知機能スタック</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { funcId: typeData.functions.dominant, label: '主機能', opacity: 1 },
                  { funcId: typeData.functions.auxiliary, label: '補助機能', opacity: 0.8 },
                  { funcId: typeData.functions.tertiary, label: '第3機能', opacity: 0.6 },
                  { funcId: typeData.functions.inferior, label: '劣等機能', opacity: 0.4 },
                ].map(({ funcId, label, opacity }) => (
                  <div
                    key={funcId}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `${typeData.color}${Math.round(opacity * 15).toString(16).padStart(2, '0')}`,
                      border: `1px solid ${typeData.color}${Math.round(opacity * 50).toString(16).padStart(2, '0')}`,
                    }}
                  >
                    <div className="text-xs text-gray-400 mb-1">{label}</div>
                    <div className="text-2xl font-bold" style={{ color: typeData.color }}>{funcId}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!saved ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {saving ? '保存中...' : '結果をプロフィールに保存'}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div
                    className="px-6 py-3 rounded-xl text-green-400 font-semibold text-center"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    ✓ 保存しました
                  </div>
                  <Link
                    href="/consultation"
                    className="px-6 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                  >
                    AI相談を始める
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl text-indigo-300 font-semibold text-center border border-indigo-500/40 hover:border-indigo-400 transition-all"
                  >
                    ダッシュボードへ
                  </Link>
                </div>
              )}
              <Link
                href={`/types/${resultType}`}
                className="px-6 py-3 rounded-xl text-indigo-300 font-semibold text-center border border-indigo-500/40 hover:border-indigo-400 transition-all"
              >
                {resultType}の詳細を見る
              </Link>
              <button
                onClick={restart}
                className="px-6 py-3 rounded-xl text-gray-400 font-semibold border border-gray-700 hover:border-gray-500 transition-all"
              >
                再診断する
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>質問 {currentQ + 1} / {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(99,102,241,0.2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          key={currentQ}
          className="p-8 rounded-2xl animate-slide-up"
          style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {/* Dimension indicator */}
          <div className="flex gap-2 mb-4">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}
            >
              {question.dimensionA}/{question.dimensionB}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 group"
                style={{
                  background: 'rgba(99,102,241,0.05)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa' }}
                  >
                    {option.value}
                  </div>
                  <span className="text-gray-200 leading-relaxed">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
            disabled={currentQ === 0}
            className="text-gray-500 hover:text-gray-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 前の質問
          </button>
          <span className="text-gray-600 text-sm">
            回答済み: {Object.keys(answers).length}/{totalQuestions}
          </span>
        </div>
      </main>
    </div>
  )
}
