'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { mbtiTypes, typeGroups, cognitiveFunctions } from '@/lib/mbti-data'
import type { MbtiType } from '@/lib/mbti-data'

type GroupKey = 'all' | 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers'

export default function TypesPage() {
  const [activeGroup, setActiveGroup] = useState<GroupKey>('all')

  const filteredTypes: MbtiType[] =
    activeGroup === 'all'
      ? (Object.keys(mbtiTypes) as MbtiType[])
      : typeGroups[activeGroup as keyof typeof typeGroups].types

  const groups: { key: GroupKey; label: string; color: string }[] = [
    { key: 'all', label: 'すべて', color: '#6366f1' },
    { key: 'Analysts', label: '分析家', color: typeGroups.Analysts.color },
    { key: 'Diplomats', label: '外交官', color: typeGroups.Diplomats.color },
    { key: 'Sentinels', label: '番人', color: typeGroups.Sentinels.color },
    { key: 'Explorers', label: '探検家', color: typeGroups.Explorers.color },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold text-stone-800 mb-3">
            16の<span className="gradient-text">MBTIタイプ</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto">
            各タイプの認知機能スタック、特徴、強みと弱みを詳しく解説します
          </p>
        </div>

        {/* Group Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGroup(g.key)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={
                activeGroup === g.key
                  ? {
                      background: `${g.color}30`,
                      border: `1px solid ${g.color}`,
                      color: g.color,
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid rgba(99,102,241,0.2)',
                      color: '#78716c',
                    }
              }
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Types Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTypes.map((typeKey) => {
            const type = mbtiTypes[typeKey]
            const dominantFunc = cognitiveFunctions[type.functions.dominant]
            return (
              <Link key={typeKey} href={`/types/${typeKey}`}>
                <div
                  className="p-5 rounded-2xl h-full transition-all hover:-translate-y-1 cursor-pointer group"
                  style={{
                    background: `${type.color}08`,
                    border: `1px solid ${type.color}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${type.color}50`
                    e.currentTarget.style.background = `${type.color}15`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${type.color}20`
                    e.currentTarget.style.background = `${type.color}08`
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: type.color }}
                    >
                      {type.type}
                    </div>
                    <div
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${type.color}20`, color: type.color }}
                    >
                      {type.groupJa}
                    </div>
                  </div>

                  <div className="text-stone-800 font-bold mb-1">{type.name}</div>
                  <div className="text-stone-500 text-xs mb-3">{type.nickname}</div>

                  {/* Dominant function badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs mb-3"
                    style={{ background: `${type.color}15`, color: type.color }}
                  >
                    <span className="font-bold">{type.functions.dominant}</span>
                    <span>{dominantFunc.name}</span>
                  </div>

                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">
                    {type.description}
                  </p>

                  <div className="mt-3 flex gap-1">
                    {[type.functions.dominant, type.functions.auxiliary, type.functions.tertiary, type.functions.inferior].map((f, i) => (
                      <span
                        key={f}
                        className="text-xs px-1.5 py-0.5 rounded font-mono"
                        style={{
                          background: `${type.color}${Math.round([0.2, 0.15, 0.1, 0.06][i] * 100).toString(16).padStart(2, '0')}`,
                          color: type.color,
                          opacity: [1, 0.8, 0.6, 0.4][i],
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
