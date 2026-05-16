'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  size: number
  color: string
  trail: Array<{ x: number; y: number }>
  type: 'neural' | 'data' | 'ambient'
}

interface NeuralNode {
  x: number
  y: number
  radius: number
  color: string
  pulsePhase: number
  pulseSpeed: number
  connections: number[]
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

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // --- Neural nodes scattered across the background ---
    const nodeCount = 18
    const nodes: NeuralNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 1.5 + Math.random() * 2,
      color: [
        'rgba(0,200,255,',
        'rgba(0,255,140,',
        'rgba(168,85,247,',
        'rgba(0,200,255,',
      ][i % 4],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.012,
      connections: [],
    }))

    // Build sparse connection map (only nearby nodes)
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i === j) return
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 280 && node.connections.length < 3) {
          node.connections.push(j)
        }
      })
    })

    // --- Ambient particles ---
    const particles: Particle[] = []
    const MAX_PARTICLES = 80

    function createParticle(): Particle {
      const types: Particle['type'][] = ['neural', 'data', 'ambient']
      const type = types[Math.floor(Math.random() * 3)]
      const colors = {
        neural: 'rgba(0,200,255,',
        data: 'rgba(0,255,140,',
        ambient: 'rgba(168,85,247,',
      }
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        age: 0,
        life: 4 + Math.random() * 6,
        size: type === 'data' ? 1 : 1.5 + Math.random() * 1.5,
        color: colors[type],
        trail: [],
        type,
      }
    }

    // --- Data streams (bright flowing lines) ---
    const streams: Array<{
      x: number; y: number
      tx: number; ty: number
      progress: number; speed: number; color: string
    }> = []

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
        speed: 0.008 + Math.random() * 0.01,
        color: ['rgba(0,200,255,', 'rgba(0,255,140,', 'rgba(168,85,247,'][Math.floor(Math.random() * 3)],
      })
    }

    const draw = () => {
      // Deep space fade
      ctx.fillStyle = 'rgba(1,3,7,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const t = frameCount * 0.016

      // --- Draw neural connections (faint) ---
      nodes.forEach((node, i) => {
        node.connections.forEach(j => {
          if (j <= i) return
          const other = nodes[j]
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const alpha = Math.max(0, 0.06 - (dist / 280) * 0.05)
          if (alpha <= 0) return
          const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y)
          grad.addColorStop(0, node.color + alpha + ')')
          grad.addColorStop(1, other.color + alpha + ')')
          ctx.strokeStyle = grad
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        })
      })

      // --- Draw data streams along connections ---
      for (let i = streams.length - 1; i >= 0; i--) {
        const s = streams[i]
        s.progress += s.speed
        if (s.progress >= 1) { streams.splice(i, 1); continue }

        const cx = s.x + (s.tx - s.x) * s.progress
        const cy = s.y + (s.ty - s.y) * s.progress
        const alpha = Math.sin(s.progress * Math.PI)

        ctx.shadowBlur = 8
        ctx.shadowColor = s.color + '0.8)'
        ctx.fillStyle = s.color + (alpha * 0.9) + ')'
        ctx.beginPath()
        ctx.arc(cx, cy, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // --- Draw neural nodes ---
      nodes.forEach(node => {
        node.pulsePhase += node.pulseSpeed
        const pulse = 0.5 + 0.5 * Math.sin(node.pulsePhase)

        // Outer glow ring
        const outerGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6)
        outerGrad.addColorStop(0, node.color + (0.15 * pulse) + ')')
        outerGrad.addColorStop(1, node.color + '0)')
        ctx.fillStyle = outerGrad
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.shadowBlur = 12
        ctx.shadowColor = node.color + '0.9)'
        ctx.fillStyle = node.color + (0.7 + 0.3 * pulse) + ')'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // --- Spawn and draw ambient particles ---
      if (frameCount % 4 === 0 && particles.length < MAX_PARTICLES) {
        particles.push(createParticle())
      }
      if (frameCount % 60 === 0 && streams.length < 15) {
        spawnStream()
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.age += 0.016
        if (p.age > p.life) { particles.splice(i, 1); continue }

        p.x += p.vx
        p.y += p.vy

        const lifeRatio = p.age / p.life
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.45

        ctx.fillStyle = p.color + alpha + ')'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
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
