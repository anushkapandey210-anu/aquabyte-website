import { Droplet } from 'lucide-react'

export default function AquaButton() {
  return (
    <button
      aria-label="Open Aqua assistant"
      className="fixed right-6 bottom-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-aqua-blue to-aqua-teal text-white grid place-items-center shadow-xl shadow-blue-500/40 hover:scale-110 transition"
    >
      <span className="absolute inset-0 rounded-full bg-aqua-teal opacity-40 animate-ping" />
      <Droplet className="relative" />
    </button>
  )
}