'use client'

import React, { useEffect, useRef } from 'react'

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle system
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      age: number
      life: number
      color: string
    }> = []

    // Create initial particles
    function createParticle() {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        age: 0,
        life: Math.random() * 3 + 2,
        color: ['rgba(0, 200, 255, 0.3)', 'rgba(0, 255, 140, 0.2)', 'rgba(168, 85, 247, 0.2)'][
          Math.floor(Math.random() * 3)
        ],
      })
    }

    // Animation loop
    let frameCount = 0
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create new particles occasionally
      if (frameCount % 3 === 0 && particles.length < 100) {
        createParticle()
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.age += 0.016

        if (p.age > p.life) {
          particles.splice(i, 1)
          continue
        }

        p.x += p.vx
        p.y += p.vy

        const opacity = 1 - p.age / p.life
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${opacity * 0.5})`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      frameCount++
      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
