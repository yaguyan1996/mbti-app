'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'
import { agentData, functionRoles } from '@/lib/agent-data'
import type { MbtiType, CognitiveFunctionId } from '@/lib/mbti-data'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AgentFuncPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const funcIdRaw = (params.func as string).toUpperCase() as CognitiveFunctionId

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'skills' | 'patterns'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) return <LoadingScreen />
  if (!user || !user.mbtiType) return null

  const typeKey = user.mbtiType as MbtiType
  const typeData = mbtiTypes[typeKey]
  const funcData = cognitiveFunctions[funcIdRaw]
  const agent = agentData[funcIdRaw]

  if (!funcData || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f0' }}>
        <div className="text-center">
          <p className="text-stone-500">機能が見つかりません</p>
          <Link href="/agent" className="text-indigo-500 mt-2 block">← エージェント一覧に戻る</Link>
        </div>
      </div>
    )
  }

  // Determine function position
  const functions = typeData.functions
  const positionMap: Record<string, string> = {
    [functions.dominant]: 'dominant',
    [functions.auxiliary]: 'auxiliary',
    [functions.tertiary]: 'tertiary',
    [functions.inferior]: 'inferior',
    [functions.opposing]: 'opposing',
    [functions.criticalParent]: 'criticalParent',
    [functions.trickster]: 'trickster',
    [functions.demon]: 'demon',
  }
  const positionKey = positionMap[funcIdRaw]
  const positionLabel = positionKey ? functionRoles[positionKey] : '認知機能'
  const positionNum = ['dominant','auxiliary','tertiary','inferior','opposing','criticalParent','trickster','demon'].indexOf(positionKey) + 1
  const isShadow = positionNum >= 5
  const accentColor = isShadow ? '#a78bfa' : agent.color

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: new Date() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    const assistantMessage: Message = { role: 'assistant', content: '', timestamp: new Date() }
    setMessages([...newMessages, assistantMessage])

    try {
      const history = newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, conversationHistory: history, funcId: funcIdRaw }),
      })

      if (!res.ok) {
        const error = await res.json()
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content = `エラー: ${error.error || '処理に失敗しました'}`
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
          for (const line of chunk.split('\n')) {
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
              } catch { /* ignore */ }
            }
          }
        }
      }
    } catch {
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />
      <div className="flex flex-1 flex-col pt-16" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Top Header */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.15)', background: '#faf7f0' }}>
          <div className="flex items-center gap-3">
            <Link href="/agent" className="text-stone-400 hover:text-stone-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: agent.bgColor, border: `1px solid ${accentColor}30` }}>
              {agent.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accentColor }}>{funcIdRaw}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${accentColor}15`, color: accentColor }}>
                  {positionLabel}
                </span>
              </div>
              <div className="text-xs text-stone-500">{agent.role}</div>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])}
              className="text-stone-500 hover:text-stone-700 text-xs px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 transition-all">
              クリア
            </button>
          )}
        </div>

        {/* Tab Bar */}
        <div className="flex" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)', background: '#faf7f0' }}>
          {([
            { id: 'chat', label: '💬 相談する' },
            { id: 'skills', label: '🛠 スキル' },
            { id: 'patterns', label: '🔍 パターン' },
          ] as const).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 text-sm font-medium transition-all"
              style={{
                color: activeTab === tab.id ? accentColor : '#78716c',
                borderBottom: activeTab === tab.id ? `2px solid ${accentColor}` : '2px solid transparent',
                background: 'transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-fade-in">
                    <div className="text-5xl mb-3">{agent.emoji}</div>
                    <h3 className="text-xl font-bold text-stone-800 mb-1">{funcIdRaw} エージェント</h3>
                    <p className="text-stone-500 text-sm mb-2">{agent.tagline}</p>
                    <p className="text-stone-400 text-xs mb-6 max-w-xs">
                      {typeData.type}の{positionLabel}として、このシーンで反応しやすい機能です
                    </p>

                    {/* Reaction scenes as quick starters */}
                    <div className="w-full max-w-md">
                      <p className="text-stone-500 text-xs mb-3">こんな時に開いてください</p>
                      <div className="space-y-2">
                        {agent.reactionScenes.map((scene, i) => (
                          <button key={i}
                            onClick={() => setInput(scene)}
                            className="w-full p-3 rounded-xl text-left text-sm text-stone-600 hover:text-stone-800 transition-all"
                            style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
                            {scene}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-3xl ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
                              {agent.emoji}
                            </div>
                            <span className="text-stone-400 text-xs">
                              {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-sm text-white' : 'rounded-tl-sm text-stone-700'}`}
                          style={msg.role === 'user'
                            ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }
                            : { background: '#fff9f0', border: '1px solid rgba(99,102,241,0.15)' }}
                        >
                          {msg.content ? (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {msg.content}
                              {isStreaming && idx === messages.length - 1 && (
                                <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                                  style={{ background: accentColor }} />
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              {[0, 150, 300].map((delay) => (
                                <div key={delay} className="w-2 h-2 rounded-full animate-bounce"
                                  style={{ background: accentColor, animationDelay: `${delay}ms` }} />
                              ))}
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

              {/* Input */}
              <div className="p-4" style={{ borderTop: '1px solid rgba(99,102,241,0.15)', background: '#faf7f0' }}>
                <div className="flex items-end gap-2 p-3 rounded-2xl"
                  style={{ background: '#fff9f0', border: `1px solid ${accentColor}30` }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`${funcIdRaw}エージェントに相談する...（Shift+Enterで送信）`}
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
                  <button onClick={sendMessage} disabled={!input.trim() || isStreaming}
                    className="p-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-stone-800">{funcIdRaw}のスキル・解決策</h2>
                <p className="text-stone-500 text-sm">{agent.tagline}</p>
              </div>

              {/* Function description */}
              <div className="p-4 rounded-2xl" style={{ background: agent.bgColor, border: `1px solid ${accentColor}20` }}>
                <div className="text-xs font-bold mb-1" style={{ color: accentColor }}>機能の説明</div>
                <p className="text-stone-600 text-sm leading-relaxed">{funcData.description}</p>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                {agent.skills.map((skill, i) => (
                  <div key={i} className="p-4 rounded-2xl" style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: accentColor }}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-stone-700">{skill.title}</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed pl-8">{skill.description}</p>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              <div className="p-4 rounded-2xl" style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.12)' }}>
                <div className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">関連キーワード</div>
                <div className="flex flex-wrap gap-2">
                  {funcData.keywords.map((kw) => (
                    <span key={kw} className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: agent.bgColor, color: accentColor }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PATTERNS TAB */}
          {activeTab === 'patterns' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-stone-800">{funcIdRaw}の行動・感情パターン</h2>
                <p className="text-stone-500 text-sm">{typeData.type}としての{positionLabel}の特徴</p>
              </div>

              {/* Reaction scenes */}
              <div className="p-4 rounded-2xl" style={{ background: '#fff9f0', border: '1px solid rgba(99,102,241,0.12)' }}>
                <div className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider">この機能が反応するシーン</div>
                <div className="space-y-2">
                  {agent.reactionScenes.map((scene, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs mt-1 shrink-0" style={{ color: accentColor }}>●</span>
                      <span className="text-sm text-stone-600">{scene}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patterns */}
              {agent.patterns.map((pattern, i) => (
                <div key={i} className="p-4 rounded-2xl"
                  style={{
                    background: pattern.type === 'strength' ? `${accentColor}08` : 'rgba(239,68,68,0.05)',
                    border: `1px solid ${pattern.type === 'strength' ? accentColor + '25' : 'rgba(239,68,68,0.2)'}`,
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{pattern.type === 'strength' ? '✨' : '⚠️'}</span>
                    <span className="text-sm font-bold"
                      style={{ color: pattern.type === 'strength' ? accentColor : '#dc2626' }}>
                      {pattern.title}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">{pattern.description}</p>
                </div>
              ))}

              {/* Shadow description */}
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(168,139,250,0.08)', border: '1px solid rgba(168,139,250,0.2)' }}>
                <div className="text-xs font-bold text-purple-500 mb-2 uppercase tracking-wider">シャドー側面</div>
                <p className="text-stone-600 text-sm leading-relaxed">{funcData.shadow}</p>
              </div>
            </div>
          )}

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
