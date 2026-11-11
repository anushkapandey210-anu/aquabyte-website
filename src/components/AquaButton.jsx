import { useEffect, useRef, useState } from 'react'
import { Droplet, X, Send } from 'lucide-react'
import icon from '../assets/aquabyte-icon.png'
import { getAquaReply, suggestions } from '../services/aqua'

// Turns **text** into bold
function Rich({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 ? <b key={i} className="text-aqua-teal">{part}</b> : <span key={i}>{part}</span>
  )
}

export default function AquaButton() {
  const [open, setOpen] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm **Aqua**, your AquaByte assistant. Ask me about water quality, usage, peak hours or your devices." },
  ])
  const endRef = useRef(null)
  const inputRef = useRef(null)

  // Hide the "Hi, I'm Aqua" bubble after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 8000)
    return () => clearTimeout(t)
  }, [])

  // Scroll to the newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus the input when the chat opens
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close with the Esc key
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function send(text) {
    const t = text.trim()
    if (!t || typing) return
    setMessages(m => [...m, { from: 'me', text: t }])
    setInput('')
    setTyping(true)
    const reply = await getAquaReply(t)
    setTyping(false)
    setMessages(m => [...m, { from: 'bot', text: reply }])
  }

  const asked = messages.filter(m => m.from === 'me').map(m => m.text)
  const chips = suggestions.filter(s => !asked.includes(s)).slice(0, 3)

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div role="dialog" aria-label="Aqua assistant"
          className="fixed right-4 sm:right-6 bottom-28 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-900/30 flex flex-col overflow-hidden origin-bottom-right animate-pop">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-aqua-blue to-aqua-teal text-white">
            <span className="w-10 h-10 rounded-xl bg-white grid place-items-center shrink-0">
              <img src={icon} alt="" className="w-7" />
            </span>
            <div className="flex-1">
              <b className="block font-display text-base">Aqua</b>
              <span className="flex items-center gap-1.5 text-xs opacity-90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> AquaByte assistant · online
              </span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 grid place-items-center transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm animate-enter ${
                  m.from === 'me'
                    ? 'self-end bg-aqua-blue text-white rounded-br-md'
                    : 'self-start bg-white border border-slate-200 rounded-bl-md'}`}>
                {m.from === 'me' ? m.text : <Rich text={m.text} />}
              </div>
            ))}
            {typing && (
              <div className="self-start bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3.5 flex gap-1">
                {[0, 0.15, 0.3].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-aqua-grey animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {!typing && chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2.5 bg-slate-50">
              {chips.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs text-aqua-blue bg-white border border-blue-200 rounded-full px-3 py-1.5 hover:bg-aqua-lightblue transition">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2 p-3 border-t border-slate-200">
            <input id="aqua-input" ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask Aqua anything…" autoComplete="off"
              className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-aqua-blue" />
            <button type="submit" aria-label="Send" disabled={!input.trim() || typing}
              className="w-11 rounded-xl bg-aqua-blue text-white grid place-items-center disabled:opacity-50 transition">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      {/* "Hi, I'm Aqua" bubble */}
      {showTip && !open && (
        <div className="fixed right-24 bottom-9 z-50 bg-white border border-slate-200 rounded-2xl rounded-br-sm px-3.5 py-2 text-sm shadow-lg animate-enter hidden sm:block">
          Hi, I'm Aqua. Ask me about your water.
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => { setOpen(!open); setShowTip(false) }}
        aria-label={open ? 'Close Aqua assistant' : 'Open Aqua assistant'}
        className="fixed right-4 sm:right-6 bottom-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-aqua-blue to-aqua-teal text-white grid place-items-center shadow-xl shadow-blue-500/40 hover:scale-110 transition">
        {!open && <span className="absolute inset-0 rounded-full bg-aqua-teal opacity-40 animate-ping" />}
        {open ? <X className="relative" /> : <Droplet className="relative" />}
      </button>
    </>
  )
}