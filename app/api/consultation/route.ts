import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { verifyToken, getUser } from '@/lib/auth'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 })
    }

    const user = await getUser(payload.userId)
    if (!user || !user.mbtiType) {
      return NextResponse.json({ error: 'タイプが設定されていません' }, { status: 400 })
    }

    const body = await request.json()
    const { message, conversationHistory = [], mode = 'open', imageData } = body

    if (!message && !imageData) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 })
    }

    const trimmedHistory = conversationHistory.slice(-6).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: String(m.content || '').slice(0, 1000),
    }))

    const typeKey = user.mbtiType as keyof typeof mbtiTypes
    const typeData = mbtiTypes[typeKey]

    if (!typeData) {
      return NextResponse.json({ error: '無効なタイプです' }, { status: 400 })
    }

    const { dominant, auxiliary, tertiary, inferior, opposing, criticalParent, trickster, demon } = typeData.functions
    const domFunc = cognitiveFunctions[dominant]
    const auxFunc = cognitiveFunctions[auxiliary]
    const terFunc = cognitiveFunctions[tertiary]
    const infFunc = cognitiveFunctions[inferior]
    const oppFunc = cognitiveFunctions[opposing]
    const cpFunc = cognitiveFunctions[criticalParent]
    const trickFunc = cognitiveFunctions[trickster]
    const demonFunc = cognitiveFunctions[demon]

    const systemPrompt = `あなたはMBTI認知機能の専門家メンターです。ユーザーのMBTIタイプは${user.mbtiType}（${typeData.name}）です。

【認知機能スタック】
主機能: ${dominant}（${domFunc.name}）、補助: ${auxiliary}（${auxFunc.name}）、第3: ${tertiary}（${terFunc.name}）、劣等: ${inferior}（${infFunc.name}）
シャドー: ${opposing}、${criticalParent}、${trickster}、${demon}

【回答の原則】
- 普通の会話文で書く。見出し・箇条書き・記号（---、##、***など）は使わない
- 段落は2〜3文でまとめ、改行は最小限にする
- 温かく共感的に、判断せず受け入れる姿勢で
- 認知機能の用語は使うが必ずわかりやすく補足する
- 日本語で自然な文体、具体的かつ実践的に
- 返答は300〜500文字程度を目安にする`

    const modeInstructions: Record<string, string> = {
      analyze: `今回のモードは「整理・分析」です。状況の全体像と背景を読み解き、何が起きているかを認知機能の観点から自然な会話文で説明してください。`,
      solve: `今回のモードは「解決策を探す」です。分析は最小限にして、今日からできる具体的なアクションを自然な会話文で2〜3個提案してください。`,
      empathize: `今回のモードは「共感・傾聴」です。まず気持ちに寄り添い、感情を受け止める言葉をかけてください。アドバイスは控えめにして、最後に一つだけ質問を添えてください。`,
      open: '',
    }

    const finalSystemPrompt = systemPrompt + (modeInstructions[mode as string] ?? '')

    const userContent = imageData
      ? [
          {
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: imageData.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageData.base64 as string,
            },
          },
          { type: 'text' as const, text: message || 'この画像について、私の認知機能の観点からアドバイスをください。' },
        ]
      : message

    const messages = [
      ...trimmedHistory,
      { role: 'user' as const, content: userContent },
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: finalSystemPrompt,
      messages,
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg || '相談の処理に失敗しました' }, { status: 500 })
  }
}
