'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VoiceInput from '@/components/VoiceInput'
import CognitiveFunctionCard from '@/components/CognitiveFunctionCard'
import { useAuth } from '@/lib/hooks/useAuth'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

type ConsultationMode = 'analyze' | 'solve' | 'empathize' | 'open'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MODES: { id: ConsultationMode; icon: string; title: string; description: string }[] = [
  { id: 'analyze', icon: '🔍', title: '整理・分析したい', description: '問題や感情を整理して全体像を把握したい' },
  { id: 'solve', icon: '💡', title: '解決策を見つけたい', description: '具体的な解決策やアクションプランを見つけたい' },
  { id: 'empathize', icon: '💝', title: '共感・傾聴してほしい', description: 'まず気持ちを受け止めてもらいたい・アウトプットしたい' },
  { id: 'open', icon: '💭', title: 'アバウトに相談したい', description: 'とりあえず話したい・何でも相談したい' },
]

export default function ConsultationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showFunctions, setShowFunctions] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [mode, setMode] = useState<ConsultationMode>('open')
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Load conversation history on mount
  useEffect(() => {
    if (!user || historyLoaded) return
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((m: { role: 'user' | 'assistant'; content: string; timestamp: string }) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }))
          )
        }
        setHistoryLoaded(true)
      })
      .catch(() => setHistoryLoaded(true))
  }, [user, historyLoaded])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save conversation whenever messages change (debounced)
  useEffect(() => {
    if (!historyLoaded || messages.length === 0) return
    const timer = setTimeout(() => {
      fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      }).catch(() => {})
    }, 1000)
    return () => clearTimeout(timer)
  }, [messages, historyLoaded])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) return null

  if (!user.mbtiType) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div
            className="p-10 rounded-2xl text-center max-w-md animate-fade-in"
            style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">
              先に診断テストを受けてください
            </h2>
            <p className="text-stone-500 mb-6">
              AI相談では、あなたのタイプと認知機能スタックに基づいたパーソナライズされたアドバイスを提供します。まずは診断テストを受けてください。
            </p>
            <Link
              href="/test"
              className="inline-block px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              診断テストを受ける
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const typeKey = user.mbtiType as MbtiType
  const typeData = mbtiTypes[typeKey]

  const currentModeInfo = MODES.find((m) => m.id === mode)!

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    // Add placeholder for assistant response
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages([...newMessages, assistantMessage])

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: history,
          mode,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content = `エラー: ${error.error || '相談に失敗しました'}`
          return updated
        })
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  fullText += parsed.text
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1].content = fullText
                    return updated
                  })
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].content = 'ネットワークエラーが発生しました。もう一度お試しください。'
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.shiftKey || e.metaKey)) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleVoiceTranscript = (text: string) => {
    setInput((prev) => prev + (prev ? ' ' : '') + text)
    textareaRef.current?.focus()
  }

  const clearChat = () => {
    setMessages([])
    fetch('/api/conversations', { method: 'DELETE' }).catch(() => {})
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <div className="flex flex-1 pt-16" style={{ height: 'calc(100vh - 0px)' }}>
        {/* Sidebar - Function Stack */}
        <div
          className={`fixed right-0 top-16 bottom-0 w-72 transition-transform z-40 ${
            showFunctions ? 'translate-x-0' : 'translate-x-full'
          } md:relative md:translate-x-0 md:flex md:flex-col`}
          style={{
            background: '#faf7f0',
            borderLeft: '1px solid rgba(99,102,241,0.15)',
            width: showFunctions ? '280px' : undefined,
          }}
        >
          <div className="p-4 overflow-y-auto h-full">
            <h3 className="text-sm font-bold text-stone-600 mb-4 uppercase tracking-wider">
              あなたの認知機能スタック
            </h3>

            {/* Type Badge */}
            <div
              className="p-3 rounded-xl mb-4"
              style={{
                background: `${typeData.color}15`,
                border: `1px solid ${typeData.color}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: typeData.color }}>
                  {typeData.type}
                </span>
                <div>
                  <div className="text-stone-800 text-sm font-medium">{typeData.name}</div>
                  <div className="text-stone-500 text-xs">{typeData.groupJa}</div>
                </div>
              </div>
            </div>

            {/* Main Functions */}
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              メイン4機能
            </div>
            {[
              { funcId: typeData.functions.dominant, label: '主機能', opacity: 1 },
              { funcId: typeData.functions.auxiliary, label: '補助機能', opacity: 0.8 },
              { funcId: typeData.functions.tertiary, label: '第3機能', opacity: 0.6 },
              { funcId: typeData.functions.inferior, label: '劣等機能', opacity: 0.4 },
            ].map(({ funcId, label, opacity }) => (
              <CognitiveFunctionCard
                key={funcId}
                funcId={funcId as CognitiveFunctionId}
                label={label}
                color={typeData.color}
                opacity={opacity}
                isShadow={false}
              />
            ))}

            {/* Shadow Functions */}
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-4 mb-2">
              シャドー4機能
            </div>
            {[
              { funcId: typeData.functions.opposing, label: '反対人格', opacity: 0.5 },
              { funcId: typeData.functions.criticalParent, label: '批判的な親', opacity: 0.45 },
              { funcId: typeData.functions.trickster, label: 'トリックスター', opacity: 0.4 },
              { funcId: typeData.functions.demon, label: '悪魔', opacity: 0.35 },
            ].map(({ funcId, label, opacity }) => (
              <CognitiveFunctionCard
                key={funcId}
                funcId={funcId as CognitiveFunctionId}
                label={label}
                color="#a78bfa"
                opacity={opacity}
                isShadow={true}
              />
            ))}

            {/* よく使っている機能 */}
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                💪 よく使っている機能
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { funcId: typeData.functions.dominant, label: '主機能', desc: '最も自然に使える得意な機能' },
                  { funcId: typeData.functions.auxiliary, label: '補助機能', desc: '主機能を支え、バランスをとる' },
                ].map(({ funcId, label, desc }) => (
                  <div key={funcId} className="p-2 rounded-lg"
                    style={{ background: `${typeData.color}10`, border: `1px solid ${typeData.color}20` }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: typeData.color }}>{funcId}</span>
                      <span className="text-xs text-stone-500">{label}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>

              {/* 課題と向き合っている機能 */}
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                🌱 課題と向き合っている機能
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { funcId: typeData.functions.inferior, label: '劣等機能', desc: 'ストレス時に暴走しやすく、最大の成長領域' },
                  { funcId: typeData.functions.tertiary, label: '第3機能', desc: '発達途上で、使いすぎると疲弊しやすい' },
                ].map(({ funcId, label, desc }) => (
                  <div key={funcId} className="p-2 rounded-lg"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: '#d97706' }}>{funcId}</span>
                      <span className="text-xs text-stone-500">{label}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-stone-400 text-xs leading-relaxed">
                AIはこれらの認知機能の視点から、あなたへのアドバイスをカスタマイズします。
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}
          >
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-stone-800 font-bold">AI 認知機能メンター</h1>
                <p className="text-stone-500 text-xs">
                  {typeData.type}の認知機能スタックに基づいたパーソナライズ相談
                </p>
              </div>
              {/* Mode badge when chat has messages */}
              {messages.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      color: '#a5b4fc',
                    }}
                  >
                    <span>{currentModeInfo.icon}</span>
                    <span>{currentModeInfo.title}</span>
                    <span className="text-stone-400">▼</span>
                  </button>
                  {showModeDropdown && (
                    <div
                      className="absolute top-full left-0 mt-1 w-56 rounded-xl z-50 overflow-hidden shadow-xl"
                      style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.25)' }}
                    >
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { setMode(m.id); setShowModeDropdown(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-indigo-50"
                          style={{
                            background: mode === m.id ? 'rgba(99,102,241,0.15)' : undefined,
                          }}
                        >
                          <span>{m.icon}</span>
                          <div>
                            <div className="text-stone-800 text-xs font-medium">{m.title}</div>
                            <div className="text-stone-500 text-xs leading-tight">{m.description}</div>
                          </div>
                          {mode === m.id && <span className="ml-auto text-indigo-400 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-stone-500 hover:text-stone-700 text-xs px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 transition-all"
                >
                  会話をクリア
                </button>
              )}
              <button
                onClick={() => setShowFunctions(!showFunctions)}
                className="md:hidden text-stone-500 hover:text-stone-800 p-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="text-5xl mb-4">💭</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  {user.username}さん、何でも相談してください
                </h3>
                <p className="text-stone-500 max-w-md leading-relaxed mb-6">
                  仕事、人間関係、自己成長、日々の悩みなど、
                  {typeData.type}の認知機能スタックの観点からアドバイスします。
                </p>

                {/* Mode Selector - 2x2 grid */}
                <div className="w-full max-w-lg mb-6">
                  <p className="text-stone-500 text-sm mb-3">相談モードを選んでください</p>
                  <div className="grid grid-cols-2 gap-3">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                        style={{
                          background: mode === m.id ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.05)',
                          border: mode === m.id
                            ? '2px solid rgba(99,102,241,0.7)'
                            : '2px solid rgba(99,102,241,0.15)',
                        }}
                      >
                        <div className="text-2xl mb-2">{m.icon}</div>
                        <div
                          className="text-sm font-semibold mb-1"
                          style={{ color: mode === m.id ? '#6366f1' : '#44403c' }}
                        >
                          {m.title}
                        </div>
                        <div className="text-stone-500 text-xs leading-snug">{m.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggestion buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    '人間関係で悩んでいることがあります',
                    '自分の強みをどう活かせばいいですか？',
                    '劣等機能について教えてください',
                    '仕事でストレスを感じています',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="p-3 rounded-xl text-left text-sm text-stone-500 hover:text-stone-800 transition-all"
                      style={{
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl ${msg.role === 'user' ? 'order-2' : 'order-1'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                          AI
                        </div>
                        <span className="text-stone-400 text-xs">
                          {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm text-white'
                          : 'rounded-tl-sm text-stone-700'
                      } ${msg.content === '' && isStreaming && idx === messages.length - 1 ? 'streaming-cursor' : ''}`}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                          : {
                              background: '#fff9f0',
                              border: '1px solid rgba(99,102,241,0.15)',
                            }
                      }
                    >
                      {msg.content ? (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                          {isStreaming && idx === messages.length - 1 && (
                            <span
                              className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                              style={{
                                background: '#6366f1',
                                animation: 'blink 1s step-end infinite',
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex justify-end mt-1">
                        <span className="text-stone-400 text-xs">
                          {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-4"
            style={{ borderTop: '1px solid rgba(99,102,241,0.15)', background: '#faf7f0' }}
          >
            <div
              className="flex items-end gap-2 p-3 rounded-2xl"
              style={{
                background: '#fff9f0',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力...（Shift+Enterまたは⌘+Enterで送信）"
                className="flex-1 bg-transparent text-stone-800 placeholder-stone-400 text-sm resize-none outline-none"
                style={{ maxHeight: '120px', minHeight: '40px' }}
                rows={1}
                disabled={isStreaming}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`
                }}
              />
              <div className="flex items-center gap-2 shrink-0">
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={isStreaming} />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isStreaming}
                  className="p-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-center text-stone-400 text-xs mt-2">
              Claude AIによる認知機能分析 · {typeData.type} スタック: {typeData.functions.dominant}→{typeData.functions.auxiliary}→{typeData.functions.tertiary}→{typeData.functions.inferior}
            </p>
          </div>
        </div>
      </div>
    </div>
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
