import { useEffect, useRef } from 'react'

export default function LiveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frame
    let width = 0
    let height = 0
    const pointer = { x: -1000, y: -1000 }
    const particles = Array.from({ length: 42 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0 }))

    const reset = () => {
      width = canvas.width = window.innerWidth * devicePixelRatio
      height = canvas.height = window.innerHeight * devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      particles.forEach(p => Object.assign(p, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: 1 + Math.random() * 1.5 }))
    }

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const dark = document.documentElement.dataset.theme === 'dark'
      const line = dark ? '135,190,80' : '111,143,35'
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < -10 || p.x > window.innerWidth + 10) p.vx *= -1
        if (p.y < -10 || p.y > window.innerHeight + 10) p.vy *= -1
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        if (distance < 150) { p.vx += (p.x - pointer.x) / 120000; p.vy += (p.y - pointer.y) / 120000 }
        context.beginPath(); context.fillStyle = `rgba(${line},${dark ? .24 : .16})`; context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill()
      })
      for (let i = 0; i < particles.length; i += 1) for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i], b = particles[j], d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 155) { context.beginPath(); context.strokeStyle = `rgba(${line},${(1 - d / 155) * (dark ? .11 : .08)})`; context.lineWidth = 1; context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke() }
      }
      frame = requestAnimationFrame(render)
    }
    const move = event => { pointer.x = event.clientX; pointer.y = event.clientY }
    reset(); render(); window.addEventListener('resize', reset); window.addEventListener('pointermove', move)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', reset); window.removeEventListener('pointermove', move) }
  }, [])

  return <canvas ref={canvasRef} className="live-background" aria-hidden="true" />
}
