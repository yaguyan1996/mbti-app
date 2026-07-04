'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { testQuestions, calculateMbtiType, mbtiTypes } from '@/lib/mbti-data'
import type { MbtiType } from '@/lib/mbti-data'

type Phase = 'intro' | 'test' | 'result'

const SCALE_LABELS = ['当てはまる', '', 'どちらでも', '', '当てはまらない']

export default function TestPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [resultType, setResultType] = useState<MbtiType | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  const question = testQuestions[currentQ]
  const progress = (currentQ / testQuestions.length) * 100
  const totalQuestions = testQuestions.length

  const handleSelect = (value: number) => {
    setSelected(value)
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    setTimeout(() => {
      setSelected(null)
      if (currentQ < totalQuestions - 1) {
        setCurrentQ(currentQ + 1)
      } else {
        const type = calculateMbtiType(newAnswers)
        setResultType(type)
        setPhase('result')
      }
    }, 300)
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
      if (res.ok) setSaved(true)
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
    setSelected(null)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-2xl w-full text-center animate-fade-in">
            <div className="text-6xl mb-6">🧬</div>
            <h1 className="text-4xl font-bold text-stone-800 mb-4">MBTI 診断テスト</h1>
            <p className="text-stone-500 text-lg mb-2 leading-relaxed">
              32問の質問に直感的に答えてください。
            </p>
            <p className="text-stone-400 text-sm mb-8">
              「正しい答え」はありません。今の自分に最も近い感覚で選んでください。
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              {[
                { icon: '📝', label: '32問の質問' },
                { icon: '⏱', label: '約8〜10分' },
                { icon: '🎯', label: 'シナリオベース' },
                { icon: '🧠', label: '5段階で測定' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-stone-600 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mb-8 p-4 rounded-xl text-sm text-stone-500 text-left max-w-md mx-auto"
              style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <div className="font-semibold text-stone-600 mb-1">回答のコツ</div>
              <div>「こうあるべき」ではなく「自然とそうなる」方を選ぶと精度が上がります。</div>
            </div>
            <button onClick={() => setPhase('test')}
              className="px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
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
      <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-stone-800 mb-2">診断結果</h1>
              <p className="text-stone-500">あなたのMBTIタイプが判明しました</p>
            </div>

            <div className="p-8 rounded-2xl text-center mb-6"
              style={{ background: `${typeData.color}10`, border: `2px solid ${typeData.color}40` }}>
              <div className="text-7xl font-bold mb-3" style={{ color: typeData.color }}>{resultType}</div>
              <div className="text-3xl font-bold text-stone-800 mb-1">{typeData.name}</div>
              <div className="text-stone-500 mb-2">{typeData.nickname}</div>
              <div className="inline-block text-sm px-3 py-1 rounded-full"
                style={{ background: `${typeData.color}20`, color: typeData.color }}>
                {typeData.groupJa}
              </div>
              <p className="text-stone-600 mt-6 leading-relaxed">{typeData.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-800 mb-4 text-center">あなたの認知機能スタック</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { funcId: typeData.functions.dominant, label: '主機能', opacity: 1 },
                  { funcId: typeData.functions.auxiliary, label: '補助機能', opacity: 0.8 },
                  { funcId: typeData.functions.tertiary, label: '第3機能', opacity: 0.6 },
                  { funcId: typeData.functions.inferior, label: '劣等機能', opacity: 0.4 },
                ].map(({ funcId, label, opacity }) => (
                  <div key={funcId} className="p-4 rounded-xl text-center"
                    style={{ background: `${typeData.color}${Math.round(opacity * 15).toString(16).padStart(2, '0')}`, border: `1px solid ${typeData.color}${Math.round(opacity * 50).toString(16).padStart(2, '0')}` }}>
                    <div className="text-xs text-stone-500 mb-1">{label}</div>
                    <div className="text-2xl font-bold" style={{ color: typeData.color }}>{funcId}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              {!saved ? (
                <button onClick={handleSave} disabled={saving}
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {saving ? '保存中...' : '結果をプロフィールに保存'}
                </button>
              ) : (
                <>
                  <div className="px-6 py-3 rounded-xl text-green-600 font-semibold text-center"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    ✓ 保存しました
                  </div>
                  <Link href="/agent" className="px-6 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    機能エージェントを使う
                  </Link>
                  <Link href="/consultation" className="px-6 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    AI相談を始める
                  </Link>
                </>
              )}
              <Link href={`/types/${resultType}`}
                className="px-6 py-3 rounded-xl text-indigo-500 font-semibold text-center border border-indigo-300 hover:border-indigo-400 transition-all">
                {resultType}の詳細を見る
              </Link>
              <button onClick={restart}
                className="px-6 py-3 rounded-xl text-stone-500 font-semibold border border-stone-300 hover:border-stone-400 transition-all">
                再診断する
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const currentAnswer = answers[question.id]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>質問 {currentQ + 1} / {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
          </div>
        </div>

        {/* Question Card */}
        <div key={currentQ} className="rounded-2xl p-8 animate-slide-up"
          style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.15)' }}>

          {/* Dimension badge */}
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
              {question.dimensionA} / {question.dimensionB}
            </span>
          </div>

          <h2 className="text-xl font-bold text-stone-800 mb-8 leading-relaxed">
            {question.text}
          </h2>

          {/* 5-point scale */}
          <div className="mb-6">
            {/* Labels */}
            <div className="flex justify-between text-xs text-stone-500 mb-3 px-1">
              <span className="max-w-[35%] text-left font-medium text-stone-600">{question.labelA}</span>
              <span className="max-w-[35%] text-right font-medium text-stone-600">{question.labelB}</span>
            </div>

            {/* Scale buttons */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = selected === val || currentAnswer === val
                const size = val === 3 ? 'w-10 h-10' : val === 1 || val === 5 ? 'w-12 h-12' : 'w-11 h-11'
                return (
                  <button
                    key={val}
                    onClick={() => handleSelect(val)}
                    className={`flex-1 ${size} mx-auto rounded-full flex items-center justify-center font-bold transition-all hover:scale-110 active:scale-95`}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : val === 3
                        ? 'rgba(99,102,241,0.06)'
                        : 'rgba(99,102,241,0.1)',
                      border: isSelected
                        ? 'none'
                        : '2px solid rgba(99,102,241,0.2)',
                      color: isSelected ? '#fff' : '#6366f1',
                      fontSize: val === 3 ? '12px' : '14px',
                    }}
                  >
                    {val}
                  </button>
                )
              })}
            </div>

            {/* Scale sub-labels */}
            <div className="flex justify-between text-xs text-stone-400 mt-2 px-1">
              <span>{SCALE_LABELS[0]}</span>
              <span className="text-center">{SCALE_LABELS[2]}</span>
              <span>{SCALE_LABELS[4]}</span>
            </div>
          </div>

          {/* Already answered indicator */}
          {currentAnswer && !selected && (
            <div className="text-center text-xs text-stone-400">
              回答済み（変更できます）
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex justify-between items-center">
          <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
            disabled={currentQ === 0}
            className="text-stone-500 hover:text-stone-700 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← 前の質問
          </button>
          <span className="text-stone-400 text-xs">
            回答済み: {Object.keys(answers).length}/{totalQuestions}
          </span>
          {currentAnswer && currentQ < totalQuestions - 1 && (
            <button onClick={() => setCurrentQ(currentQ + 1)}
              className="text-indigo-500 hover:text-indigo-600 text-sm transition-colors">
              次の質問 →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
