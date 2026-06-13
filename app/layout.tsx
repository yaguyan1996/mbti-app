import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MBTI 自己理解アプリ',
  description: '認知機能で深める自己理解 - MBTIタイプ診断とAI相談',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{ backgroundColor: '#0a0a1a', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
