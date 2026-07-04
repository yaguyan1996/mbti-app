import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { verifyToken, getUser } from '@/lib/auth'
import { mbtiTypes, cognitiveFunctions } from '@/lib/mbti-data'
import { agentData } from '@/lib/agent-data'
import type { CognitiveFunctionId } from '@/lib/mbti-data'

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
    const { message, conversationHistory = [], funcId } = body

    if (!message) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 })
    }
    if (!funcId) {
      return NextResponse.json({ error: '機能IDが必要です' }, { status: 400 })
    }

    const typeKey = user.mbtiType as keyof typeof mbtiTypes
    const typeData = mbtiTypes[typeKey]
    if (!typeData) {
      return NextResponse.json({ error: '無効なMBTIタイプです' }, { status: 400 })
    }

    const funcData = cognitiveFunctions[funcId as CognitiveFunctionId]
    const agent = agentData[funcId as CognitiveFunctionId]
    if (!funcData || !agent) {
      return NextResponse.json({ error: '無効な機能IDです' }, { status: 400 })
    }

    // Determine function position in user's stack
    const functions = typeData.functions
    const funcPositions: Record<string, string> = {
      [functions.dominant]: '主機能（第1機能）',
      [functions.auxiliary]: '補助機能（第2機能）',
      [functions.tertiary]: '第三機能（第3機能）',
      [functions.inferior]: '劣等機能（第4機能）',
      [functions.opposing]: '反対人格（第5機能）',
      [functions.criticalParent]: '批判的な親（第6機能）',
      [functions.trickster]: 'トリックスター（第7機能）',
      [functions.demon]: '悪魔（第8機能）',
    }
    const funcPosition = funcPositions[funcId] || '認知機能'

    const systemPrompt = `あなたはMBTI認知機能の専門エージェントです。
ユーザーのMBTIタイプは${user.mbtiType}（${typeData.name}）です。

【今回の担当機能】
${funcId}（${funcData.name}）- ${funcData.fullName}
ユーザーにとってのポジション：${funcPosition}

【機能の説明】
${funcData.description}

【この機能が反応するシーン】
${agent.reactionScenes.map((s, i) => `${i + 1}. ${s}`).join('\n')}

【この機能のシャドー側面】
${funcData.shadow}

${agent.systemPromptExtra}

【回答の原則】
- このエージェントとして、${funcId}の視点に特化してサポートする
- 温かく共感的に、判断せず受け入れる姿勢で
- 具体的・実践的なアクションを提示する
- 認知機能の用語は使うが必ずわかりやすく補足する
- 日本語で自然な文体`

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ]

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
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
    console.error('Agent error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message || 'エージェントの処理に失敗しました' }, { status: 500 })
  }
}
