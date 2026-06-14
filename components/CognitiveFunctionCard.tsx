'use client'
import { useState } from 'react'
import { cognitiveFunctions } from '@/lib/mbti-data'
import type { CognitiveFunctionId } from '@/lib/mbti-data'

interface Props {
  funcId: CognitiveFunctionId
  label: string
  color: string
  opacity?: number
  isShadow?: boolean
}

export default function CognitiveFunctionCard({ funcId, label, color, opacity = 1, isShadow = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const func = cognitiveFunctions[funcId]

  return (
    <div
      className="rounded-xl mb-2 overflow-hidden transition-all"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}15`,
        opacity: 0.4 + opacity * 0.6,
      }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color }}>
              {funcId}
            </span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        </div>
        <div className="text-white text-xs font-medium">{func.name}</div>
        <div className="text-gray-500 text-xs mt-1 leading-relaxed">
          {func.keywords.slice(0, 3).join(' · ')}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs transition-colors"
          style={{ color: `${color}99` }}
        >
          {expanded ? '閉じる ▲' : '解説を見る ▼'}
        </button>
      </div>
      {expanded && (
        <div
          className="px-3 pb-3"
          style={{ background: `${color}05`, borderTop: `1px solid ${color}10` }}
        >
          <p className="text-gray-400 text-xs leading-relaxed mt-2">
            {func.description}
          </p>
          {isShadow && func.shadow && (
            <p className="text-gray-500 text-xs leading-relaxed mt-2 italic">
              {func.shadow}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
