'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  age: number; life: number; size: number
  color: string; type: 'neural' | 'data' | 'ambient' | 'spark'
}

interface NeuralNode {
  x: number; y: number; baseX: number; baseY: number
  radius: number; color: string
  pulsePhase: number; pulseSpeed: number
  connections: number[]; driftAngle: number; driftSpeed: number
}

interface DataStream {
  x: number; y: number; tx: number; ty: number
  progress: number; speed: number; color: string
  trail: Array<{ x: number; y: number; alpha: number }>
}

interface WarpLine {
  x: number; y1: number; y2: number; speed: number
  alpha: number; width: number; color: string
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frameCount = 0
    let w = 0, h = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w
      canvas.height = h
    }
    resize()

    // ── NEURAL CONSTELLATION ──
    const nodeCount = 28
    const nodes: NeuralNode[] = Array.from({ length: nodeCount }, (_, i) => {
      const x = Math.random() * w
      const y = Math.random() * h
      return {
        x, y, baseX: x, baseY: y,
        radius: 1.2 + Math.random() * 2.2,
        color: [
          'rgba(0,200,255,', 'rgba(0,255,140,',
          'rgba(168,85,247,', 'rgba(0,200,255,',
          'rgba(255,180,40,',
        ][i % 5],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        connections: [],
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.0003 + Math.random() * 0.0008,
      }
    })

    // Build connection map — denser connections
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i === j) return
        const dx = node.baseX - other.baseX
        const dy = node.baseY - other.baseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 320 && node.connections.length < 4) {
          node.connections.push(j)
        }
      })
    })

    // ── PARTICLES ──
    const particles: Particle[] = []
    const MAX_PARTICLES = 120

    function createParticle(): Particle {
      const types: Particle['type'][] = ['neural', 'data', 'ambient', 'spark']
      const type = types[Math.floor(Math.random() * types.length)]
      const colors = {
        neural:  'rgba(0,200,255,',
        data:    'rgba(0,255,140,',
        ambient: 'rgba(168,85,247,',
        spark:   'rgba(255,220,100,',
      }
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * (type === 'spark' ? 1.5 : 0.5),
        vy: (Math.random() - 0.5) * (type === 'spark' ? 1.5 : 0.5) - (type === 'data' ? 0.3 : 0),
        age: 0,
        life: type === 'spark' ? 1.5 + Math.random() * 2 : 5 + Math.random() * 7,
        size: type === 'spark' ? 0.8 : type === 'data' ? 1.0 : 1.2 + Math.random() * 1.5,
        color: colors[type],
        type,
      }
    }

    // ── DATA STREAMS (with trails) ──
    const streams: DataStream[] = []

    function spawnStream() {
      const ni = Math.floor(Math.random() * nodes.length)
      const node = nodes[ni]
      if (!node.connections.length) return
      const ti = node.connections[Math.floor(Math.random() * node.connections.length)]
      const target = nodes[ti]
      streams.push({
        x: node.x, y: node.y,
        tx: target.x, ty: target.y,
        progress: 0,
        speed: 0.006 + Math.random() * 0.012,
        color: ['rgba(0,200,255,', 'rgba(0,255,140,', 'rgba(168,85,247,'][Math.floor(Math.random() * 3)],
        trail: [],
      })
    }

    // ── WARP LINES (horizontal scan lines that drift upward) ──
    const warpLines: WarpLine[] = []

    function spawnWarpLine() {
      warpLines.push({
        x: 0,
        y1: h + 20,
        y2: h + 20 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.6,
        alpha: 0.015 + Math.random() * 0.02,
        width: w,
        color: Math.random() > 0.5 ? 'rgba(0,200,255,' : 'rgba(168,85,247,',
      })
    }

    // ── MAIN DRAW LOOP ──
    const draw = () => {
      // Atmospheric fade with depth
      ctx.fillStyle = 'rgba(1,3,7,0.12)'
      ctx.fillRect(0, 0, w, h)

      // ── Drift neural nodes slowly ──
      nodes.forEach(node => {
        node.driftAngle += node.driftSpeed
        node.x = node.baseX + Math.cos(node.driftAngle) * 12
        node.y = node.baseY + Math.sin(node.driftAngle * 0.7) * 8
      })

      // ── Draw neural connections with animated dash ──
      const dashOffset = frameCount * 0.3
      nodes.forEach((node, i) => {
        node.connections.forEach(j => {
          if (j <= i) return
          const other = nodes[j]
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const alpha = Math.max(0, 0.07 - (dist / 320) * 0.06)
          if (alpha <= 0) return

          const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y)
          grad.addColorStop(0, node.color + alpha + ')')
          grad.addColorStop(1, other.color + alpha + ')')

          ctx.strokeStyle = grad
          ctx.lineWidth = 0.6
          ctx.setLineDash([4, 8])
          ctx.lineDashOffset = -dashOffset
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          // Curved connections for organic feel
          const mx = (node.x + other.x) / 2 + (dy * 0.08)
          const my = (node.y + other.y) / 2 - (dx * 0.08)
          ctx.quadraticCurveTo(mx, my, other.x, other.y)
          ctx.stroke()
        })
      })
      ctx.setLineDash([])

      // ── Draw data streams with trailing particles ──
      for (let i = streams.length - 1; i >= 0; i--) {
        const s = streams[i]
        s.progress += s.speed
        if (s.progress >= 1) { streams.splice(i, 1); continue }

        const cx = s.x + (s.tx - s.x) * s.progress
        const cy = s.y + (s.ty - s.y) * s.progress
        const alpha = Math.sin(s.progress * Math.PI)

        // Add trail point
        s.trail.push({ x: cx, y: cy, alpha })
        if (s.trail.length > 12) s.trail.shift()

        // Draw trail
        for (let t = 0; t < s.trail.length; t++) {
          const tp = s.trail[t]
          const trailAlpha = (t / s.trail.length) * tp.alpha * 0.4
          ctx.fillStyle = s.color + trailAlpha + ')'
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Head
        ctx.shadowBlur = 12
        ctx.shadowColor = s.color + '0.9)'
        ctx.fillStyle = s.color + (alpha * 0.95) + ')'
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // ── Draw neural nodes ──
      nodes.forEach(node => {
        node.pulsePhase += node.pulseSpeed
        const pulse = 0.5 + 0.5 * Math.sin(node.pulsePhase)

        // Deep ambient halo
        const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 10)
        halo.addColorStop(0, node.color + (0.06 * pulse) + ')')
        halo.addColorStop(1, node.color + '0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 10, 0, Math.PI * 2)
        ctx.fill()

        // Pulse ring (appears intermittently)
        if (pulse > 0.85) {
          const ringAlpha = (pulse - 0.85) / 0.15 * 0.15
          ctx.strokeStyle = node.color + ringAlpha + ')'
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius * 4 + pulse * 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Core dot
        ctx.shadowBlur = 16
        ctx.shadowColor = node.color + '0.95)'
        ctx.fillStyle = node.color + (0.6 + 0.4 * pulse) + ')'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // ── Warp lines (atmospheric horizontal scans) ──
      for (let i = warpLines.length - 1; i >= 0; i--) {
        const wl = warpLines[i]
        wl.y1 -= wl.speed
        wl.y2 -= wl.speed
        if (wl.y2 < -10) { warpLines.splice(i, 1); continue }

        const grad = ctx.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.15, wl.color + wl.alpha + ')')
        grad.addColorStop(0.5, wl.color + (wl.alpha * 1.5) + ')')
        grad.addColorStop(0.85, wl.color + wl.alpha + ')')
        grad.addColorStop(1, 'transparent')

        ctx.fillStyle = grad
        ctx.fillRect(0, wl.y1, w, wl.y2 - wl.y1)
      }

      // ── Ambient particles ──
      if (frameCount % 3 === 0 && particles.length < MAX_PARTICLES) {
        particles.push(createParticle())
      }
      if (frameCount % 40 === 0 && streams.length < 20) {
        spawnStream()
      }
      if (frameCount % 180 === 0 && warpLines.length < 5) {
        spawnWarpLine()
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.age += 0.016
        if (p.age > p.life) { particles.splice(i, 1); continue }

        p.x += p.vx
        p.y += p.vy

        // Sparks have slight gravity
        if (p.type === 'spark') { p.vy += 0.01; p.vx *= 0.995 }

        const lifeRatio = p.age / p.life
        const alpha = Math.sin(lifeRatio * Math.PI) * (p.type === 'spark' ? 0.7 : 0.4)

        if (p.type === 'spark') {
          ctx.shadowBlur = 4
          ctx.shadowColor = p.color + '0.8)'
        }
        ctx.fillStyle = p.color + alpha + ')'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      frameCount++
      animId = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
