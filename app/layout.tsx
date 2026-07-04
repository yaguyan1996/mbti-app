import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SELF TYPE',
  description: 'ユング心理学の認知機能理論で深める自己理解 - 16タイプ診断とAI相談',
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
