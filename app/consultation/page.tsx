'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VoiceInput from '@/components/VoiceInput'
import { useAuth } from '@/lib/hooks/useAuth'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ConsultationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showFunctions, setShowFunctions] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a1a' }}>
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div
            className="p-10 rounded-2xl text-center max-w-md animate-fade-in"
            style={{ background: '#111128', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              先に診断テストを受けてください
            </h2>
            <p className="text-gray-400 mb-6">
              AI相談では、あなたのMBTIタイプと認知機能スタックに基づいたパーソナライズされたアドバイスを提供します。まずは診断テストを受けてください。
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
    if (e.key === 'Enter' && !e.shiftKey) {
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a1a' }}>
      <Navbar />
      <div className="flex flex-1 pt-16" style={{ height: 'calc(100vh - 0px)' }}>
        {/* Sidebar - Function Stack */}
        <div
          className={`fixed right-0 top-16 bottom-0 w-72 transition-transform z-40 ${
            showFunctions ? 'translate-x-0' : 'translate-x-full'
          } md:relative md:translate-x-0 md:flex md:flex-col`}
          style={{
            background: '#0d0d22',
            borderLeft: '1px solid rgba(99,102,241,0.15)',
            width: showFunctions ? '280px' : undefined,
          }}
        >
          <div className="p-4 overflow-y-auto h-full">
            <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
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
                  <div className="text-white text-sm font-medium">{typeData.name}</div>
                  <div className="text-gray-500 text-xs">{typeData.groupJa}</div>
                </div>
              </div>
            </div>

            {/* Function Stack */}
            {[
              { funcId: typeData.functions.dominant, label: '主機能', opacity: 1 },
              { funcId: typeData.functions.auxiliary, label: '補助機能', opacity: 0.8 },
              { funcId: typeData.functions.tertiary, label: '第3機能', opacity: 0.6 },
              { funcId: typeData.functions.inferior, label: '劣等機能', opacity: 0.4 },
            ].map(({ funcId, label, opacity }) => {
              const func = cognitiveFunctions[funcId as CognitiveFunctionId]
              return (
                <div
                  key={funcId}
                  className="p-3 rounded-xl mb-2"
                  style={{
                    background: `${typeData.color}08`,
                    border: `1px solid ${typeData.color}15`,
                    opacity: 0.4 + opacity * 0.6,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: typeData.color }}>
                      {funcId}
                    </span>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <div className="text-white text-xs font-medium">{func.name}</div>
                  <div className="text-gray-500 text-xs mt-1 leading-relaxed">
                    {func.keywords.slice(0, 3).join(' · ')}
                  </div>
                </div>
              )
            })}

            <div className="mt-4 pt-4 border-t border-indigo-900/20">
              <p className="text-gray-500 text-xs leading-relaxed">
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
            <div>
              <h1 className="text-white font-bold">AI 認知機能メンター</h1>
              <p className="text-gray-500 text-xs">
                {typeData.type}の認知機能スタックに基づいたパーソナライズ相談
              </p>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-gray-500 hover:text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                >
                  会話をクリア
                </button>
              )}
              <button
                onClick={() => setShowFunctions(!showFunctions)}
                className="md:hidden text-gray-400 hover:text-white p-2"
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
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-5xl mb-4">💭</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {user.username}さん、何でも相談してください
                </h3>
                <p className="text-gray-400 max-w-md leading-relaxed mb-6">
                  仕事、人間関係、自己成長、日々の悩みなど、
                  {typeData.type}の認知機能スタックの観点からアドバイスします。
                </p>
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
                      className="p-3 rounded-xl text-left text-sm text-gray-400 hover:text-white transition-all"
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
                        <span className="text-gray-500 text-xs">
                          {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm text-white'
                          : 'rounded-tl-sm text-gray-200'
                      } ${msg.content === '' && isStreaming && idx === messages.length - 1 ? 'streaming-cursor' : ''}`}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                          : {
                              background: '#111128',
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
                        <span className="text-gray-500 text-xs">
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
            style={{ borderTop: '1px solid rgba(99,102,241,0.15)', background: '#0a0a1a' }}
          >
            <div
              className="flex items-end gap-2 p-3 rounded-2xl"
              style={{
                background: '#111128',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力...（Enterで送信、Shift+Enterで改行）"
                className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none"
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
            <p className="text-center text-gray-600 text-xs mt-2">
              Claude AIによるMBTI認知機能分析 · {typeData.type} スタック: {typeData.functions.dominant}→{typeData.functions.auxiliary}→{typeData.functions.tertiary}→{typeData.functions.inferior}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a1a' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">読み込み中...</p>
      </div>
    </div>
  )
}
