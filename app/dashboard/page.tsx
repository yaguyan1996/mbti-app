'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Navbar from '@/components/Navbar'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

const functionPositionLabels = ['主機能', '補助機能', '第3機能', '劣等機能']
const shadowFunctionLabels = ['反対人格', '批判的な親', 'トリックスター', '悪魔']

const ALL_TYPES: MbtiType[] = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<MbtiType | ''>('')
  const [saving, setSaving] = useState(false)

  const saveType = async () => {
    if (!selectedType) return
    setSaving(true)
    await fetch('/api/mbti/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mbtiType: selectedType }),
    })
    window.location.reload()
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) return null

  const typeData = user.mbtiType ? mbtiTypes[user.mbtiType as MbtiType] : null
  const functions = typeData
    ? [typeData.functions.dominant, typeData.functions.auxiliary, typeData.functions.tertiary, typeData.functions.inferior]
    : []
  const shadowFunctions = typeData
    ? [typeData.functions.opposing, typeData.functions.criticalParent, typeData.functions.trickster, typeData.functions.demon]
    : []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            おかえりなさい、{' '}
            <span className="gradient-text">{user.username}</span>さん
          </h1>
          <p className="text-gray-400 mt-1">あなたの自己理解の旅を続けましょう</p>
        </div>

        {typeData ? (
          <>
            {/* Type Badge */}
            <div
              className="p-6 rounded-2xl mb-6 animate-slide-up"
              style={{
                background: `${typeData.color}10`,
                border: `1px solid ${typeData.color}30`,
              }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="text-5xl font-bold"
                  style={{ color: typeData.color }}
                >
                  {typeData.type}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{typeData.name}</div>
                  <div className="text-gray-400">{typeData.nickname}</div>
                  <div
                    className="text-sm mt-1 px-3 py-0.5 rounded-full inline-block"
                    style={{ background: `${typeData.color}20`, color: typeData.color }}
                  >
                    {typeData.groupJa}
                  </div>
                </div>
                <div className="ml-auto">
                  <Link
                    href={`/types/${typeData.type}`}
                    className="text-sm px-4 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: `${typeData.color}20`, color: typeData.color, border: `1px solid ${typeData.color}40` }}
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            </div>

            {/* Function Stack */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">認知機能スタック</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {functions.map((funcId, idx) => {
                  const func = cognitiveFunctions[funcId as CognitiveFunctionId]
                  const opacity = [1, 0.85, 0.65, 0.45][idx]
                  return (
                    <div
                      key={funcId}
                      className="p-4 rounded-xl"
                      style={{
                        background: `${typeData.color}${Math.round(opacity * 15).toString(16).padStart(2, '0')}`,
                        border: `1px solid ${typeData.color}${Math.round(opacity * 40).toString(16).padStart(2, '0')}`,
                        opacity: 0.5 + opacity * 0.5,
                      }}
                    >
                      <div className="text-xs text-gray-400 mb-1">{functionPositionLabels[idx]}</div>
                      <div className="text-2xl font-bold" style={{ color: typeData.color }}>
                        {funcId}
                      </div>
                      <div className="text-white text-sm font-medium mt-1">{func.name}</div>
                      <div className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
                        {func.keywords.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shadow Function Stack */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">シャドー機能スタック</h2>
              <p className="text-gray-500 text-sm mb-4">無意識に働く影の自己。ストレス時や防衛的な場面で現れる。</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shadowFunctions.map((funcId, idx) => {
                  const func = cognitiveFunctions[funcId as CognitiveFunctionId]
                  const shadowColors = ['#94a3b8', '#78716c', '#a78bfa', '#f43f5e']
                  const color = shadowColors[idx]
                  return (
                    <div
                      key={funcId}
                      className="p-4 rounded-xl"
                      style={{
                        background: `${color}10`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <div className="text-xs mb-1" style={{ color: `${color}99` }}>
                        第{idx + 5}機能 · {shadowFunctionLabels[idx]}
                      </div>
                      <div className="text-2xl font-bold" style={{ color }}>
                        {funcId}
                      </div>
                      <div className="text-gray-300 text-sm font-medium mt-1">{func.name}</div>
                      <div className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
                        {func.keywords.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div
              className="p-5 rounded-xl mb-6"
              style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              <p className="text-gray-300 leading-relaxed">{typeData.description}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                  <span>✓</span> 強み
                </h3>
                <ul className="space-y-1.5">
                  {typeData.strengths.map((s) => (
                    <li key={s} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <span>△</span> 成長領域
                </h3>
                <ul className="space-y-1.5">
                  {typeData.growthAreas.map((g) => (
                    <li key={g} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          /* No type yet */
          <div
            className="p-8 rounded-2xl mb-6 animate-slide-up"
            style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">MBTIタイプを設定しましょう</h2>
              <p className="text-gray-400">診断テストを受けるか、すでにタイプを知っている場合は直接選択できます</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 直接選択 */}
              <div
                className="p-6 rounded-xl"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <h3 className="text-white font-bold mb-1">すでにタイプを知っている</h3>
                <p className="text-gray-500 text-sm mb-4">16タイプから選択してください</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {ALL_TYPES.map((type) => {
                    const t = mbtiTypes[type]
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className="py-2 rounded-lg text-sm font-bold transition-all"
                        style={{
                          background: selectedType === type ? `${t.color}30` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${selectedType === type ? t.color : 'rgba(255,255,255,0.1)'}`,
                          color: selectedType === type ? t.color : '#9ca3af',
                        }}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
                {selectedType && (
                  <div className="mb-3 text-sm text-gray-300">
                    <span style={{ color: mbtiTypes[selectedType].color }} className="font-bold">{selectedType}</span>
                    {' '}— {mbtiTypes[selectedType].name}
                  </div>
                )}
                <button
                  onClick={saveType}
                  disabled={!selectedType || saving}
                  className="w-full py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {saving ? '保存中...' : 'このタイプに設定する'}
                </button>
              </div>

              {/* 診断テスト */}
              <div
                className="p-6 rounded-xl flex flex-col"
                style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <h3 className="text-white font-bold mb-1">診断テストを受ける</h3>
                <p className="text-gray-500 text-sm mb-4">20問の質問に答えてタイプを診断します</p>
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="text-5xl">📋</div>
                </div>
                <Link
                  href="/test"
                  className="block text-center py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  診断テストを受ける
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-white mb-4">クイックアクション</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <QuickActionCard
            icon="📋"
            title="診断テスト"
            description={typeData ? 'タイプを再診断する' : 'MBTIタイプを診断する'}
            href="/test"
            color="#6366f1"
          />
          <QuickActionCard
            icon="💬"
            title="AI相談"
            description="認知機能の観点からアドバイスを受ける"
            href="/consultation"
            color="#8b5cf6"
            disabled={!typeData}
          />
          <QuickActionCard
            icon="📚"
            title="16タイプ一覧"
            description="全てのMBTIタイプを確認する"
            href="/types"
            color="#10b981"
          />
        </div>
      </main>
    </div>
  )
}

function QuickActionCard({
  icon, title, description, href, color, disabled = false
}: {
  icon: string; title: string; description: string; href: string; color: string; disabled?: boolean
}) {
  if (disabled) {
    return (
      <div
        className="p-5 rounded-xl opacity-50 cursor-not-allowed"
        style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      >
        <div className="text-3xl mb-3">{icon}</div>
        <div className="font-bold text-white mb-1">{title}</div>
        <div className="text-gray-500 text-sm">{description}</div>
        <div className="text-xs text-gray-600 mt-2">先に診断テストを受けてください</div>
      </div>
    )
  }
  return (
    <Link href={href}>
      <div
        className="p-5 rounded-xl transition-all hover:-translate-y-1 cursor-pointer"
        style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      >
        <div className="text-3xl mb-3">{icon}</div>
        <div className="font-bold text-white mb-1">{title}</div>
        <div className="text-gray-400 text-sm">{description}</div>
        <div className="text-xs mt-2 font-medium" style={{ color }}>
          開く →
        </div>
      </div>
    </Link>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a1a' }}>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4"
        />
        <p className="text-gray-400">読み込み中...</p>
      </div>
    </div>
  )
}
