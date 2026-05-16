'use client'

import React, { useEffect, useRef } from 'react'

export function OrbitSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    let rotation = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      rotation += 0.0005

      // Orbital shells
      const shells = [80, 150, 220, 290]
      shells.forEach((radius, index) => {
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.15 - index * 0.03})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()

        // Orbiting particles
        const particleCount = 3 + index
        for (let i = 0; i < particleCount; i++) {
          const angle = (rotation + (i / particleCount) * Math.PI * 2)
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          const colors = ['rgba(0, 200, 255, 0.8)', 'rgba(0, 255, 140, 0.6)', 'rgba(168, 85, 247, 0.6)']
          ctx.fillStyle = colors[i % colors.length]
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

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
