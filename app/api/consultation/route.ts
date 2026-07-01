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
      return NextResponse.json({ error: 'MBTIタイプが設定されていません' }, { status: 400 })
    }

    const body = await request.json()
    const { message, conversationHistory = [], mode = 'open' } = body

    if (!message) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 })
    }

    const typeKey = user.mbtiType as keyof typeof mbtiTypes
    const typeData = mbtiTypes[typeKey]

    if (!typeData) {
      return NextResponse.json({ error: '無効なMBTIタイプです' }, { status: 400 })
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

【全8認知機能スタック】
■ メイン4機能（意識的・自我機能）
  第1機能 主機能:    ${dominant}（${domFunc.name}）- 最も得意で自然に使う、自己のコア
  第2機能 補助機能:  ${auxiliary}（${auxFunc.name}）- 主機能を支えバランスを取る
  第3機能 第三機能:  ${tertiary}（${terFunc.name}）- 発達途上、成長の余地がある
  第4機能 劣等機能:  ${inferior}（${infFunc.name}）- ストレス時に暴走しやすい弱点

■ シャドー4機能（無意識的・影の自己）
  第5機能 反対人格:    ${opposing}（${oppFunc.name}）- 防衛的に使われ他者批判に現れやすい
  第6機能 批判的な親:  ${criticalParent}（${cpFunc.name}）- 内なる批判者、自己嫌悪の源
  第7機能 トリックスター: ${trickster}（${trickFunc.name}）- 矛盾・反発行動として現れる
  第8機能 悪魔:       ${demon}（${demonFunc.name}）- 極度ストレス下で破壊的に現れる

【問題解決フレームワーク：5ステップで分析】

以下のSTEPを見出しとして使い、構造的に回答してください。

**STEP 1｜事例の把握**
ユーザーが話している具体的な出来事・状況を整理し、何が起きているかを明確にする。

**STEP 2｜事情・背景の理解**
状況の背景にある文脈・環境・関係性を深掘りする。${user.mbtiType}としてどのように体験しているかを認知機能で読み解き、どの機能が活発/抑圧されているかを特定する。

**STEP 3｜問題提起**
表面的な問題の奥にある本質的な課題を提示する。「なぜこの問題が起きているか」を認知機能の観点から解説し、シャドー機能（第5〜8機能）が無意識に影響していないか検証する。

**STEP 4｜パターン化**
${user.mbtiType}が陥りやすい思考・行動パターンと照合する。主機能の使いすぎ、劣等機能の暴走、シャドー機能の干渉など、繰り返しやすいパターンの構造を明示する。

**STEP 5｜改善のためのアクション**
${user.mbtiType}の強み（${typeData.strengths.slice(0, 3).join('、')}）を活かした具体的な行動提案。劣等機能・シャドー機能との向き合い方と、今日からできる具体的なアクションを3つ以上提示する。

【回答の原則】
- 温かく共感的に、判断せず受け入れる姿勢で
- 認知機能の用語は使うが必ずわかりやすく補足する
- 日本語で自然な文体、具体的かつ実践的に`

    const modeInstructions: Record<string, string> = {
      analyze: `

【今回の相談モード：整理・分析】
ユーザーは状況を整理して全体像を把握したいと思っています。
STEP 1〜3（状況把握・背景理解・問題提起）を丁寧に行い、何が起きているかを明確に構造化してください。パターンと関係性を図式的に整理し、「何が・なぜ・どのように」を明確にすることを最優先にしてください。`,
      solve: `

【今回の相談モード：解決策を探す】
ユーザーは具体的な解決策を求めています。
分析は簡潔にとどめ、STEP 4〜5（パターン化・アクション）に重点を置いてください。今日からできる具体的な行動を3〜5個、優先順位と共に提示してください。`,
      empathize: `

【今回の相談モード：共感・傾聴】
ユーザーはまず気持ちを受け止めてもらいたいと思っています。
5ステップの分析フレームワークは使わず、まず感情に寄り添い「そうだったんですね」「それは辛かったですね」と共感を示してください。ユーザーの気持ちを言語化して反射し、アドバイスよりも「あなたの気持ちを理解している」ことを伝えることを最優先にしてください。最後に「もう少し聞かせてもらえますか？」と促す質問を1つだけ添えてください。`,
      open: '',
    }

    const finalSystemPrompt = systemPrompt + (modeInstructions[mode as string] ?? '')

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ]

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: finalSystemPrompt,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: chunk.delta.text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Consultation error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message || '相談の処理に失敗しました' }, { status: 500 })
  }
}
