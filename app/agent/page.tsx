'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { mbtiTypes } from '@/lib/mbti-data'
import { agentData, functionRoles } from '@/lib/agent-data'
import type { AgentData } from '@/lib/agent-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

export default function AgentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) return <LoadingScreen />
  if (!user) return null

  if (!user.mbtiType) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div className="p-10 rounded-2xl text-center max-w-md" style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">先に診断テストを受けてください</h2>
            <p className="text-stone-500 mb-6">エージェントはあなたのタイプに基づいてカスタマイズされます。</p>
            <Link href="/test" className="inline-block px-8 py-3 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              診断テストを受ける
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const typeKey = user.mbtiType as MbtiType
  const typeData = mbtiTypes[typeKey]

  const stackOrder: { key: keyof typeof typeData.functions; roleKey: string }[] = [
    { key: 'dominant', roleKey: 'dominant' },
    { key: 'auxiliary', roleKey: 'auxiliary' },
    { key: 'tertiary', roleKey: 'tertiary' },
    { key: 'inferior', roleKey: 'inferior' },
    { key: 'opposing', roleKey: 'opposing' },
    { key: 'criticalParent', roleKey: 'criticalParent' },
    { key: 'trickster', roleKey: 'trickster' },
    { key: 'demon', roleKey: 'demon' },
  ]

  const mainFunctions = stackOrder.slice(0, 4)
  const shadowFunctions = stackOrder.slice(4)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span>🧠</span>
            <span>{typeData.type} の8機能エージェント</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            認知機能エージェント
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
            8つの認知機能それぞれに専門エージェントがいます。<br />
            機能が反応している瞬間に開いて、相談・スキル・パターン理解を深めましょう。
          </p>
        </div>

        {/* Main 4 Functions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: '#6366f1' }} />
            <h2 className="text-sm font-bold text-stone-600 uppercase tracking-wider">メイン4機能（意識的・自我機能）</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainFunctions.map(({ key, roleKey }, index) => {
              const funcId = typeData.functions[key] as CognitiveFunctionId
              const agent = agentData[funcId]
              const role = functionRoles[roleKey]
              return (
                <AgentCard
                  key={funcId}
                  funcId={funcId}
                  agent={agent}
                  role={role}
                  position={index + 1}
                  isShadow={false}
                />
              )
            })}
          </div>
        </div>

        {/* Shadow 4 Functions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: '#a78bfa' }} />
            <h2 className="text-sm font-bold text-stone-600 uppercase tracking-wider">シャドー4機能（無意識・影の自己）</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shadowFunctions.map(({ key, roleKey }, index) => {
              const funcId = typeData.functions[key] as CognitiveFunctionId
              const agent = agentData[funcId]
              const role = functionRoles[roleKey]
              return (
                <AgentCard
                  key={funcId}
                  funcId={funcId}
                  agent={agent}
                  role={role}
                  position={index + 5}
                  isShadow={true}
                />
              )
            })}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-10 p-5 rounded-2xl text-sm text-stone-500 leading-relaxed"
          style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <span className="font-semibold text-stone-600">使い方：</span>
          機能が反応していると感じた瞬間に、そのエージェントを開いてください。
          相談・スキル・感情・行動パターンの理解を通じて、自己理解が深まります。
        </div>
      </main>
    </div>
  )
}

function AgentCard({
  funcId, agent, role, position, isShadow,
}: {
  funcId: CognitiveFunctionId
  agent: AgentData
  role: string
  position: number
  isShadow: boolean
}) {
  const accentColor = isShadow ? '#a78bfa' : agent.color

  return (
    <Link href={`/agent/${funcId.toLowerCase()}`}>
      <div
        className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group"
        style={{
          background: '#fff9f0',
          border: `1px solid ${accentColor}30`,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{ background: agent.bgColor, border: `1px solid ${accentColor}30` }}>
              {agent.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold" style={{ color: accentColor }}>{funcId}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${accentColor}15`, color: accentColor }}>
                  第{position}機能
                </span>
              </div>
              <div className="text-xs text-stone-500">{role}</div>
            </div>
          </div>
          <svg className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-1 shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="mb-3">
          <div className="text-sm font-semibold text-stone-700">{agent.role}</div>
          <div className="text-xs text-stone-500 mt-0.5">{agent.tagline}</div>
        </div>

        <div className="space-y-1">
          {agent.reactionScenes.slice(0, 2).map((scene, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-xs mt-0.5" style={{ color: accentColor }}>●</span>
              <span className="text-xs text-stone-500">{scene}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5">
          <span className="text-xs font-medium" style={{ color: accentColor }}>エージェントを開く</span>
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: accentColor }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f0' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-stone-500">読み込み中...</p>
      </div>
    </div>
  )
}
