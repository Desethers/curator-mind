'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  saved?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  bg: '#0C0B0A',
  text: '#F2EDE8',
  accent: '#D4A07A',
  muted: 'rgba(242, 237, 232, 0.38)',
  mutedMid: 'rgba(242, 237, 232, 0.55)',
  surface: 'rgba(242, 237, 232, 0.04)',
  surfaceHover: 'rgba(242, 237, 232, 0.07)',
  border: 'rgba(242, 237, 232, 0.09)',
  borderMid: 'rgba(242, 237, 232, 0.14)',
  userText: 'rgba(242, 237, 232, 0.62)',
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Manrope', system-ui, sans-serif",
} as const

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: "Quelle est la dernière image à laquelle vous ne pouviez plus cesser de penser ?",
  saved: false,
}

const DEFAULT_CHIPS = [
  "ce qui me hante",
  "quelque chose de brutal",
  "montrez-moi une œuvre",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

/**
 * Parse agent message content:
 * - [[profile]] tokens are stripped from visible text
 * - *mirror phrases* are rendered as styled emphasis ("mirror moment")
 */
function parseAgentContent(content: string): ReactNode[] {
  const cleaned = content.replace(/\[\[.+?\]\]/g, '').trim()
  if (!cleaned) return []

  const parts = cleaned.split(/(\*[^*\n]+\*)/)

  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em
          key={i}
          style={{
            fontStyle: 'italic',
            fontSize: '1.13em',
            letterSpacing: '-0.015em',
            color: C.text,
            display: 'inline',
          }}
        >
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function extractProfile(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      const match = messages[i].content.match(/\[\[(.+?)\]\]/)
      if (match) return match[1]
    }
  }
  return null
}

function cleanForNote(content: string) {
  return content.replace(/\[\[.+?\]\]/g, '').replace(/\*/g, '').trim()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{ height: 1.5, backgroundColor: 'rgba(242,237,232,0.05)', flexShrink: 0 }}>
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: C.accent,
          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: progress > 0 ? `0 0 10px ${C.accent}55` : 'none',
        }}
      />
    </div>
  )
}

function ProfileBanner({ statement }: { statement: string }) {
  return (
    <div
      style={{
        padding: '14px 28px',
        textAlign: 'center',
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(212, 160, 122, 0.04)',
        animation: 'crystallize 1s ease-out, profileBannerIn 0.6s ease-out',
      }}
    >
      <p
        style={{
          fontFamily: C.serif,
          fontStyle: 'italic',
          fontSize: 16,
          color: C.accent,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        {statement}
      </p>
    </div>
  )
}

function AgentMessage({
  message,
  isStreaming,
  onSave,
}: {
  message: Message
  isStreaming: boolean
  onSave: (id: string) => void
}) {
  const nodes = parseAgentContent(message.content)
  const isEmpty = nodes.length === 0

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        animation: message.id !== 'init' ? 'messageIn 0.45s ease-out both' : 'none',
      }}
    >
      <button
        className="agent-message-btn"
        onClick={() => !isEmpty && onSave(message.id)}
        title={message.saved ? 'Sauvegardé' : 'Appuyez pour sauvegarder'}
        style={{
          background: 'none',
          border: 'none',
          padding: '10px 12px',
          margin: '-10px -12px',
          cursor: isEmpty ? 'default' : 'pointer',
          textAlign: 'left',
          maxWidth: '88%',
          borderRadius: 8,
          transition: 'background 0.15s ease',
        }}
      >
        <p
          className="agent-message-text"
          style={{
            fontFamily: C.serif,
            fontSize: 17.5,
            lineHeight: 1.68,
            color: 'rgba(242, 237, 232, 0.92)',
            margin: 0,
            transition: 'color 0.15s ease',
          }}
        >
          {nodes}
          {isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: 1.5,
                height: '0.9em',
                backgroundColor: C.accent,
                marginLeft: 3,
                verticalAlign: 'middle',
                animation: 'blink 0.9s step-end infinite',
                borderRadius: 1,
              }}
            />
          )}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 6,
            height: 14,
          }}
        >
          {message.saved ? (
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: C.accent,
                animation: 'savedPulse 0.4s ease-out',
              }}
            >
              sauvegardé
            </span>
          ) : (
            <span
              className="save-hint"
              style={{
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: C.muted,
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
            >
              appuyer pour noter
            </span>
          )}
        </div>
      </button>
    </div>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <p
        style={{
          fontFamily: C.sans,
          fontSize: 14,
          lineHeight: 1.6,
          color: C.userText,
          margin: 0,
          maxWidth: '72%',
          textAlign: 'right',
          fontWeight: 400,
        }}
      >
        {content}
      </p>
    </div>
  )
}

function SuggestionChip({
  label,
  onClick,
  disabled,
  index,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  index: number
}) {
  return (
    <button
      className="curateur-chip"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 12,
        padding: '7px 15px',
        borderRadius: 999,
        border: `1px solid ${C.border}`,
        backgroundColor: C.surface,
        color: 'rgba(242, 237, 232, 0.58)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.04em',
        fontFamily: C.sans,
        fontWeight: 400,
        transition: 'all 0.18s ease',
        animation: `chipIn 0.3s ease-out ${index * 0.06}s both`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

function CollectorNotes({
  notes,
  onClose,
}: {
  notes: string[]
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: 60,
        width: 270,
        backgroundColor: '#131110',
        border: `1px solid ${C.borderMid}`,
        borderRadius: 12,
        padding: '20px',
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        zIndex: 20,
        animation: 'notesSlideIn 0.28s ease-out',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.muted,
          }}
        >
          Notes collector
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: C.muted,
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: '2px 4px',
          }}
        >
          ×
        </button>
      </div>

      {notes.length === 0 ? (
        <p style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: C.serif }}>
          Appuyez sur un message pour le sauvegarder.
        </p>
      ) : (
        notes.map((note, i) => (
          <p
            key={i}
            style={{
              fontFamily: C.serif,
              fontSize: 14,
              lineHeight: 1.65,
              color: 'rgba(242,237,232,0.72)',
              margin: 0,
              marginBottom: i < notes.length - 1 ? 14 : 0,
              paddingBottom: i < notes.length - 1 ? 14 : 0,
              borderBottom: i < notes.length - 1 ? `1px solid ${C.border}` : 'none',
            }}
          >
            {note}
          </p>
        ))
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Curateur() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS)
  const [chipsKey, setChipsKey] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)
  const [exchangeCount, setExchangeCount] = useState(0)
  const [collectorNotes, setCollectorNotes] = useState<string[]>([])
  const [showNotes, setShowNotes] = useState(false)
  const [profileStatement, setProfileStatement] = useState<string | null>(null)
  const [profileCrystallized, setProfileCrystallized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamBuffer = useRef('')

  const progress = Math.min(exchangeCount / 5, 1)

  // ── Scroll to bottom on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [input])

  // ── Crystallize profile after 5 exchanges
  useEffect(() => {
    if (exchangeCount >= 5 && !profileCrystallized) {
      const profile = extractProfile(messages)
      if (profile) {
        setProfileStatement(profile)
        setTimeout(() => setProfileCrystallized(true), 300)
      }
    }
  }, [exchangeCount, messages, profileCrystallized])

  // ── Fetch dynamic chips after agent responds
  const fetchChips = useCallback(async (history: Message[]) => {
    try {
      const res = await fetch('/api/curateur/chips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const { chips: newChips } = await res.json()
      if (Array.isArray(newChips) && newChips.length === 3) {
        setChips(newChips)
        setChipsKey((k) => k + 1)
      }
    } catch {
      // Keep existing chips silently
    }
  }, [])

  // ── Send a message
  const sendMessage = useCallback(
    async (userContent: string) => {
      const trimmed = userContent.trim()
      if (!trimmed || isStreaming) return

      const userMsg: Message = { id: generateId(), role: 'user', content: trimmed }
      const agentMsgId = generateId()
      const agentMsg: Message = { id: agentMsgId, role: 'assistant', content: '' }

      const updatedMessages = [...messages, userMsg]
      setMessages([...updatedMessages, agentMsg])
      setInput('')
      setIsStreaming(true)
      setStreamingMsgId(agentMsgId)
      streamBuffer.current = ''

      const newExchangeCount = exchangeCount + 1
      setExchangeCount(newExchangeCount)

      try {
        const res = await fetch('/api/curateur', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!res.body) throw new Error('No response body')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          streamBuffer.current += decoder.decode(value, { stream: true })
          const current = streamBuffer.current
          setMessages((prev) =>
            prev.map((m) => (m.id === agentMsgId ? { ...m, content: current } : m))
          )
        }

        const finalContent = streamBuffer.current
        const finalMessages: Message[] = [
          ...updatedMessages,
          { id: agentMsgId, role: 'assistant', content: finalContent },
        ]

        setIsStreaming(false)
        setStreamingMsgId(null)

        // Update profile statement (before crystallization check)
        const profile = extractProfile(finalMessages)
        if (profile) setProfileStatement(profile)

        // Fetch contextual chips
        fetchChips(finalMessages)
      } catch (err) {
        console.error('[Curateur] Streaming error:', err)
        setIsStreaming(false)
        setStreamingMsgId(null)
      }
    },
    [messages, isStreaming, exchangeCount, fetchChips]
  )

  // ── Save message to collector notes
  const handleSaveNote = useCallback(
    (msgId: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === msgId && m.role === 'assistant' && m.content) {
            if (!m.saved) {
              const cleaned = cleanForNote(m.content)
              if (cleaned) setCollectorNotes((notes) => [...notes, cleaned])
            }
            return { ...m, saved: !m.saved }
          }
          return m
        })
      )
    },
    []
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: C.sans,
        color: C.text,
        overflow: 'hidden',
      }}
    >
      {/* Ambient progress bar */}
      <ProgressBar progress={progress} />

      {/* Header */}
      <div
        style={{
          padding: '11px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.muted,
            fontWeight: 500,
          }}
        >
          Curateur
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Profile status text */}
          {!profileCrystallized && exchangeCount > 0 && (
            <span
              style={{
                fontSize: 10.5,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.muted,
              }}
            >
              profil en construction
              {'.'.repeat(Math.min(Math.ceil(exchangeCount / 1.5), 3))}
            </span>
          )}
          {profileCrystallized && profileStatement && (
            <span
              style={{
                fontFamily: C.serif,
                fontStyle: 'italic',
                fontSize: 13.5,
                color: C.accent,
                animation: 'crystallize 1s ease-out',
              }}
            >
              {profileStatement}
            </span>
          )}

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes((v) => !v)}
            style={{
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: collectorNotes.length > 0 ? C.accent : C.muted,
              background: 'none',
              border: `1px solid ${collectorNotes.length > 0 ? 'rgba(212,160,122,0.3)' : C.border}`,
              borderRadius: 4,
              padding: '4px 11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            notes{collectorNotes.length > 0 ? ` · ${collectorNotes.length}` : ''}
          </button>
        </div>

        {/* Collector notes panel */}
        {showNotes && (
          <CollectorNotes
            notes={collectorNotes}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>

      {/* Profile crystallization banner */}
      {profileCrystallized && profileStatement && (
        <ProfileBanner statement={profileStatement} />
      )}

      {/* Messages */}
      <div
        className="curateur-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '36px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            maxWidth: 640,
            width: '100%',
            margin: '0 auto',
            padding: '0 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {messages.map((msg) =>
            msg.role === 'assistant' ? (
              <AgentMessage
                key={msg.id}
                message={msg}
                isStreaming={streamingMsgId === msg.id}
                onSave={handleSaveNote}
              />
            ) : (
              <UserMessage key={msg.id} content={msg.content} />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestion chips */}
      <div
        style={{
          maxWidth: 640,
          width: '100%',
          margin: '0 auto',
          padding: '0 28px 12px',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {chips.map((chip, i) => (
          <SuggestionChip
            key={`${chipsKey}-${i}`}
            label={chip}
            onClick={() => sendMessage(chip)}
            disabled={isStreaming}
            index={i}
          />
        ))}
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          maxWidth: 640,
          width: '100%',
          margin: '0 auto',
          padding: '14px 28px 24px',
          display: 'flex',
          gap: 14,
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Répondez…"
          rows={1}
          disabled={isStreaming}
          className="curateur-input"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: C.text,
            fontSize: 15,
            lineHeight: 1.55,
            resize: 'none',
            fontFamily: C.sans,
            fontWeight: 400,
            overflowY: 'hidden',
            minHeight: 24,
            maxHeight: 120,
          }}
        />

        {/* Send button */}
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor:
              input.trim() && !isStreaming ? C.accent : 'rgba(242,237,232,0.08)',
            border: 'none',
            cursor: input.trim() && !isStreaming ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.2s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !isStreaming)
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M7.5 13V2M2 7.5l5.5-5.5 5.5 5.5"
              stroke={input.trim() && !isStreaming ? C.bg : C.muted}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
