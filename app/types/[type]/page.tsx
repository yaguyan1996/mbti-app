import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { mbtiTypes, cognitiveFunctions, typeGroups } from '@/lib/mbti-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

interface Props {
  params: { type: string }
}

export function generateStaticParams() {
  return Object.keys(mbtiTypes).map((type) => ({ type }))
}

export default function TypeDetailPage({ params }: Props) {
  const typeKey = params.type.toUpperCase() as MbtiType
  const typeData = mbtiTypes[typeKey]

  if (!typeData) {
    notFound()
  }

  const funcs = [
    { funcId: typeData.functions.dominant, label: '主機能（Dominant）', order: 1, opacity: 1 },
    { funcId: typeData.functions.auxiliary, label: '補助機能（Auxiliary）', order: 2, opacity: 0.8 },
    { funcId: typeData.functions.tertiary, label: '第3機能（Tertiary）', order: 3, opacity: 0.6 },
    { funcId: typeData.functions.inferior, label: '劣等機能（Inferior）', order: 4, opacity: 0.4 },
  ]

  // Related types in same group
  const groupTypes = Object.values(typeGroups)
    .find((g) => g.types.includes(typeKey))
    ?.types.filter((t) => t !== typeKey) || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link href="/types" className="hover:text-stone-700 transition-colors">
            16タイプ
          </Link>
          <span>›</span>
          <span style={{ color: typeData.color }}>{typeData.type}</span>
        </div>

        {/* Header */}
        <div
          className="p-8 rounded-2xl mb-8 animate-fade-in"
          style={{
            background: `${typeData.color}10`,
            border: `2px solid ${typeData.color}30`,
          }}
        >
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: typeData.color }}
              >
                {typeData.type}
              </div>
              <div
                className="text-sm px-3 py-1 rounded-full inline-block mb-3"
                style={{ background: `${typeData.color}20`, color: typeData.color }}
              >
                {typeData.groupJa}
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-stone-800 mb-1">{typeData.name}</h1>
              <p className="text-stone-500 text-lg">{typeData.nickname}</p>
            </div>
          </div>
          <p className="text-stone-700 text-lg leading-relaxed mt-4">
            {typeData.description}
          </p>
        </div>

        {/* Long Description */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <h2 className="text-xl font-bold text-stone-800 mb-4">詳細な説明</h2>
          <p className="text-stone-700 leading-relaxed">{typeData.longDescription}</p>
        </div>

        {/* Cognitive Functions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-stone-800 mb-2">認知機能スタック</h2>
          <p className="text-stone-500 text-sm mb-4">
            {typeData.type}の思考・感情・判断パターンを形成する4つの主要認知機能
          </p>
          <div className="space-y-4">
            {funcs.map(({ funcId, label, order, opacity }) => {
              const func = cognitiveFunctions[funcId as CognitiveFunctionId]
              return (
                <div
                  key={funcId}
                  className="p-5 rounded-xl"
                  style={{
                    background: `${typeData.color}${Math.round(opacity * 12).toString(16).padStart(2, '0')}`,
                    border: `1px solid ${typeData.color}${Math.round(opacity * 40).toString(16).padStart(2, '0')}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center shrink-0">
                      <div className="text-xs text-stone-400 mb-1">#{order}</div>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: typeData.color, opacity }}
                      >
                        {funcId}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-stone-800 font-bold">{func.name}</span>
                        <span className="text-stone-500 text-xs">{label}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}
                        >
                          {func.fullName}
                        </span>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed mb-3">
                        {func.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {func.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${typeData.color}10`,
                              color: typeData.color,
                              border: `1px solid ${typeData.color}20`,
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <h3 className="font-bold text-green-400 mb-4 text-lg">強み</h3>
            <ul className="space-y-2">
              {typeData.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-stone-700">
                  <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <h3 className="font-bold text-red-400 mb-4 text-lg">弱み・課題</h3>
            <ul className="space-y-2">
              {typeData.weaknesses.map((w) => (
                <li key={w} className="flex items-start gap-2 text-stone-700">
                  <span className="text-red-400 mt-0.5 shrink-0">△</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Growth Areas */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <h3 className="font-bold text-amber-400 mb-4 text-lg">成長のための行動提案</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {typeData.growthAreas.map((g) => (
              <div
                key={g}
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.05)' }}
              >
                <span className="text-amber-400">→</span>
                <span className="text-stone-700 text-sm">{g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Famous Examples */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <h3 className="font-bold text-stone-800 mb-4 text-lg">有名な{typeData.type}の人物</h3>
          <div className="flex flex-wrap gap-2">
            {typeData.famousExamples.map((person) => (
              <span
                key={person}
                className="px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: `${typeData.color}15`,
                  color: typeData.color,
                  border: `1px solid ${typeData.color}25`,
                }}
              >
                {person}
              </span>
            ))}
          </div>
        </div>

        {/* Related Types */}
        {groupTypes.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-stone-800 mb-4 text-lg">
              同グループ（{typeData.groupJa}）の他のタイプ
            </h3>
            <div className="flex flex-wrap gap-3">
              {groupTypes.map((relType) => {
                const rel = mbtiTypes[relType]
                return (
                  <Link key={relType} href={`/types/${relType}`}>
                    <div
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                      style={{
                        background: `${rel.color}10`,
                        border: `1px solid ${rel.color}30`,
                        color: rel.color,
                      }}
                    >
                      {rel.type} - {rel.name}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back & Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/types"
            className="px-6 py-3 rounded-xl text-stone-600 font-medium border border-stone-300 hover:border-stone-400 transition-all"
          >
            ← タイプ一覧に戻る
          </Link>
          <Link
            href="/test"
            className="px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            診断テストを受ける
          </Link>
        </div>
      </main>
    </div>
  )
}
