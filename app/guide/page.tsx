'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const STEPS = [
  {
    num: 1,
    title: 'アカウント作成・ログイン',
    desc: 'ユーザー名とパスワードで簡単に登録できます。すでにアカウントをお持ちの方はログインしてください。',
    link: { href: '/register', label: '新規登録はこちら' },
  },
  {
    num: 2,
    title: 'MBTIタイプを設定する',
    desc: '20問の診断テストを受けて自動判定するか、ダッシュボードで直接タイプを選択できます。',
    link: { href: '/test', label: '診断テストを受ける' },
  },
  {
    num: 3,
    title: '認知機能スタックを確認する',
    desc: 'ダッシュボードで主機能・補助機能・第三機能・劣等機能、さらにシャドウ機能まで確認できます。',
    link: { href: '/dashboard', label: 'ダッシュボードを見る' },
  },
  {
    num: 4,
    title: 'AI相談を活用する',
    desc: 'あなたの認知機能スタックに基づいた、パーソナライズされたAIアドバイスを受けられます。Shift+Enter または ⌘+Enter で送信できます。',
    link: { href: '/consultation', label: 'AI相談を始める' },
  },
]

const TIPS = [
  { icon: '⌨️', text: 'Shift+Enter または ⌘+Enter で送信' },
  { icon: '↵', text: 'Enter のみで改行（複数行のメッセージが書けます）' },
  { icon: '💾', text: '会話履歴は自動的に保存されます' },
  { icon: '⚠️', text: 'タイプを設定しないとAI相談は利用できません' },
]

const FAQS = [
  {
    q: 'MBTIタイプがわからない',
    a: '/test で診断テストを受けてください。20問の質問に答えるとタイプが自動判定されます。',
  },
  {
    q: 'アカウントデータが消えた',
    a: 'サービスメンテナンス中はデータが消えることがあります。現在改善中です。ご不便をおかけして申し訳ありません。',
  },
  {
    q: 'AI相談はいくつでも送れますか',
    a: 'はい、制限なく使えます。何度でも自由にご利用ください。',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">使い方ガイド</h1>
          <p className="text-stone-500">MBTI 心理機能アプリの使い方をご説明します</p>
        </div>

        {/* Section 1: Steps */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              1
            </span>
            ステップバイステップ
          </h2>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex gap-5 p-6 rounded-2xl"
                style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <div
                  className="inline-flex w-10 h-10 rounded-full items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-stone-800 font-semibold mb-1">{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <Link
                    href={step.link.href}
                    className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
                  >
                    {step.link.label} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: AI tips */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              2
            </span>
            AI相談の使い方
          </h2>
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <ul className="space-y-4">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <span className="text-stone-700 text-sm leading-relaxed">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3: FAQ */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              3
            </span>
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <p className="text-stone-800 font-semibold mb-2">Q: {faq.q}</p>
                <p className="text-stone-500 text-sm leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-stone-500 text-sm mb-4">まだ登録していない方はこちら</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            無料で始める
          </Link>
        </div>
      </div>
    </div>
  )
}
