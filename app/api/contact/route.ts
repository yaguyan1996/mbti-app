import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { category, username, message } = await req.json()

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'メッセージを入力してください' },
        { status: 400 }
      )
    }

    if (process.env.KV_REST_API_URL) {
      const { kv } = await import('@vercel/kv')
      const key = `contact:${Date.now()}`
      await kv.set(key, {
        category: category || 'その他',
        username: username || null,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, message: 'お問い合わせを受け付けました' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: '送信に失敗しました。もう一度お試しください' },
      { status: 500 }
    )
  }
}
