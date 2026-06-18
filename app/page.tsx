'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient orbs */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="absolute top-40 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a78bfa',
            }}
          >
            <span>✦</span>
            <span>認知機能で深める自己理解</span>
            <span>✦</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">MBTI</span>
            <br />
            <span className="text-stone-800">自己理解アプリ</span>
          </h1>

          <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            あなたのMBTIタイプを診断し、8つの認知機能の観点から
            深い自己理解と成長をAIと共に探求しましょう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {loading ? (
              <div className="flex gap-4">
                <div className="w-36 h-12 rounded-xl bg-indigo-900 animate-pulse" />
                <div className="w-36 h-12 rounded-xl bg-indigo-900/50 animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  ダッシュボードへ
                </Link>
                <Link
                  href="/test"
                  className="px-8 py-3 rounded-xl text-indigo-600 font-semibold text-lg border border-indigo-400/50 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  診断テストを受ける
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  無料で始める
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 rounded-xl text-indigo-600 font-semibold text-lg border border-indigo-400/50 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  ログイン
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { number: '16', label: 'MBTIタイプ' },
              { number: '8', label: '認知機能' },
              { number: '20', label: '診断問題' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold gradient-text">{stat.number}</div>
                <div className="text-stone-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-800 mb-4">
            3つの主要機能
          </h2>
          <p className="text-stone-500 text-center mb-12">
            自己理解を深めるための包括的なツール
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🧬"
              title="タイプ診断"
              description="20問の質問に答えて、あなたのMBTIタイプを特定します。E/I、S/N、T/F、J/Pの4軸を詳しく分析します。"
              href="/test"
              color="#6366f1"
            />
            <FeatureCard
              icon="🧠"
              title="認知機能解析"
              description="8つの認知機能（Ni, Ne, Si, Se, Ti, Te, Fi, Fe）の視点から、あなたの思考・感情パターンを深く理解します。"
              href="/types"
              color="#8b5cf6"
            />
            <FeatureCard
              icon="💬"
              title="AI相談"
              description="Claude AIがあなたのMBTIタイプと認知機能スタックを踏まえ、日常の悩みや人生の課題に対して深い洞察とアドバイスを提供します。"
              href={user ? '/consultation' : '/register'}
              color="#f59e0b"
            />
          </div>
        </div>
      </section>

      {/* Cognitive Functions Preview */}
      <section className="py-20 px-4" style={{ background: 'rgba(99,102,241,0.04)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-800 mb-4">
            認知機能とは？
          </h2>
          <p className="text-stone-500 text-center mb-12 max-w-2xl mx-auto">
            MBTIは4文字だけでなく、8つの認知機能の組み合わせによって人の思考・感情・知覚のパターンを深く理解します
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'Ni', name: '内向き直観', desc: 'ビジョン・洞察', color: '#6366f1' },
              { id: 'Ne', name: '外向き直観', desc: '可能性・創造', color: '#8b5cf6' },
              { id: 'Si', name: '内向き感覚', desc: '記憶・伝統', color: '#10b981' },
              { id: 'Se', name: '外向き感覚', desc: '現在・体験', color: '#f59e0b' },
              { id: 'Ti', name: '内向き思考', desc: '論理・分析', color: '#3b82f6' },
              { id: 'Te', name: '外向き思考', desc: '効率・組織', color: '#06b6d4' },
              { id: 'Fi', name: '内向き感情', desc: '価値観・誠実', color: '#ec4899' },
              { id: 'Fe', name: '外向き感情', desc: '調和・共感', color: '#f97316' },
            ].map((func) => (
              <div
                key={func.id}
                className="p-4 rounded-xl text-center transition-all hover:-translate-y-1"
                style={{
                  background: `${func.color}15`,
                  border: `1px solid ${func.color}30`,
                }}
              >
                <div
                  className="text-xl font-bold mb-1"
                  style={{ color: func.color }}
                >
                  {func.id}
                </div>
                <div className="text-stone-700 text-sm font-medium">{func.name}</div>
                <div className="text-stone-500 text-xs mt-1">{func.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-10 rounded-2xl glass"
            style={{ border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              自分をもっと深く知ろう
            </h2>
            <p className="text-stone-500 mb-8">
              認知機能の視点であなたの強みと成長領域を理解し、
              より充実した人生を歩む第一歩を踏み出しましょう。
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  今すぐ始める（無料）
                </Link>
                <Link
                  href="/test"
                  className="px-8 py-3 rounded-xl text-indigo-600 font-semibold border border-indigo-400/50 hover:border-indigo-500 transition-all"
                >
                  まず診断してみる
                </Link>
              </div>
            )}
            {user && (
              <Link
                href="/consultation"
                className="inline-block px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                AI相談を始める
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-stone-500 border-t border-stone-200">
        <p>© 2024 MBTI 自己理解アプリ. Powered by Claude AI.</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: string
  title: string
  description: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <div
        className="p-6 rounded-2xl h-full transition-all hover:-translate-y-1 cursor-pointer"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}25`,
        }}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color }}>
          <span>詳しく見る</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
