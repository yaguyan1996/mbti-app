'use client'

import { useState, useRef, useEffect } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

export default function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [status, setStatus] = useState('')
  const recognitionRef = useRef<AnyRecognition>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window as AnyRecognition
      if (w.SpeechRecognition || w.webkitSpeechRecognition) {
        setIsSupported(true)
      }
    }
  }, [])

  const startRecording = () => {
    const w = window as AnyRecognition
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setStatus('このブラウザは音声入力に対応していません')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'ja-JP'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
      setStatus('録音中... 話してください')
    }

    recognition.onresult = (event: AnyRecognition) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }

      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript)
        setStatus('認識完了')
        setTimeout(() => setStatus(''), 2000)
      } else {
        setStatus(`認識中: ${transcript}`)
      }
    }

    recognition.onerror = (event: AnyRecognition) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
      if (event.error === 'not-allowed') {
        setStatus('マイクのアクセスが許可されていません')
      } else if (event.error === 'no-speech') {
        setStatus('音声が検出されませんでした')
      } else {
        setStatus('音声認識エラーが発生しました')
      }
      setTimeout(() => setStatus(''), 3000)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    setStatus('')
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-2 rounded-lg text-gray-600 cursor-not-allowed"
        title="音声入力はこのブラウザでは利用できません"
      >
        <MicIcon />
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          isRecording
            ? {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                boxShadow: '0 0 15px rgba(239,68,68,0.4)',
              }
            : {
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a78bfa',
              }
        }
        title={isRecording ? '録音停止' : '音声入力'}
      >
        {isRecording ? <MicActiveIcon /> : <MicIcon />}
      </button>
      {status && (
        <span
          className="text-xs text-gray-400 whitespace-nowrap max-w-[120px] truncate"
          title={status}
        >
          {status}
        </span>
      )}
    </div>
  )
}

function MicIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  )
}

function MicActiveIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
    </svg>
  )
}
