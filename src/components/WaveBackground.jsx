import { useEffect, useRef } from 'react'

export default function WaveBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const cx = cv.getContext('2d')
    let ph = 0
    let raf

    const size = () => {
      const d = window.devicePixelRatio || 1
      cv.width = cv.clientWidth * d
      cv.height = cv.clientHeight * d
      cx.setTransform(d, 0, 0, d, 0, 0)
    }
    size()
    window.addEventListener('resize', size)

    const layers = [
      [0.30, 'rgba(37,99,235,0.10)', 1, 26],
      [0.45, 'rgba(13,148,136,0.14)', 1.4, 20],
      [0.62, 'rgba(37,99,235,0.16)', 0.8, 14],
    ]

    const draw = () => {
      const w = cv.clientWidth, h = cv.clientHeight
      cx.clearRect(0, 0, w, h)
      layers.forEach(([y, color, speed, amp], i) => {
        cx.beginPath()
        cx.moveTo(0, h)
        for (let x = 0; x <= w; x += 8) {
          cx.lineTo(x, h * y + Math.sin(x / (140 + i * 40) + ph * speed + i) * amp + Math.sin(x / 60 + ph * speed * 1.7) * 4)
        }
        cx.lineTo(w, h)
        cx.closePath()
        cx.fillStyle = color
        cx.fill()
      })
      ph += 0.018
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full h-44 pointer-events-none" />
}