'use client'

import React, { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

// Mini sparkline chart rendered on canvas
function SparkLine({
  color,
  width = 60,
  height = 24,
  values,
}: {
  color: string
  width?: number
  height?: number
  values: number[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    ctx.clearRect(0, 0, width, height)

    if (values.length < 2) return
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = Math.max(max - min, 1)

    const step = width / (values.length - 1)
    const pts = values.map((v, i) => ({
      x: i * step,
      y: height - ((v - min) / range) * height * 0.8 - height * 0.1,
    }))

    // Fill gradient
    const fillGrad = ctx.createLinearGradient(0, 0, 0, height)
    fillGrad.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'))
    fillGrad.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'))

    ctx.beginPath()
    ctx.moveTo(pts[0].x, height)
    pts.forEach(pt => ctx.lineTo(pt.x, pt.y))
    ctx.lineTo(pts[pts.length - 1].x, height)
    ctx.closePath()
    ctx.fillStyle = fillGrad
    ctx.fill()

    // Stroke line
    ctx.beginPath()
    pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y))
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 8
    ctx.shadowColor = color
    ctx.stroke()
    ctx.shadowBlur = 0

    // Last point dot
    const last = pts[pts.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.shadowBlur = 10
    ctx.shadowColor = color
    ctx.fill()
    ctx.shadowBlur = 0
  }, [values, color, width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: 'block' }}
    />
  )
}

export function TopBar() {
  const { uptimeSeconds, metrics, neuralSeries } = useStore()

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const latencyHistory = neuralSeries.slice(-20).map(v => v * 0.9 + 10)
  const throughputHistory = neuralSeries.slice(-20).map(v => v * 0.04 + 0.5)

  return (
    <header
      className="relative flex items-center justify-between px-8 z-20 flex-shrink-0"
      style={{
        height: 64,
        background: 'linear-gradient(180deg, rgba(1,4,10,0.98) 0%, rgba(3,8,18,0.95) 100%)',
        borderBottom: '1px solid rgba(0,200,255,0.15)',
        boxShadow: '0 1px 40px rgba(0,200,255,0.07), 0 0 0 0.5px rgba(0,200,255,0.08)',
      }}
    >
      {/* Scanline accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.4) 30%, rgba(168,85,247,0.3) 70%, transparent)' }}
      />

      {/* ── LEFT: LOGO BLOCK ── */}
      <div className="flex items-center gap-5">
        {/* Animated AI core icon */}
        <div className="relative flex-shrink-0" style={{ width: 38, height: 38 }}>
          {/* Outer orbit */}
          <div
            className="absolute inset-0 rounded-full border animate-spin-slow"
            style={{ borderColor: 'rgba(0,200,255,0.20)', borderTopColor: 'rgba(0,200,255,0.60)', borderWidth: 1 }}
          />
          {/* Inner orbit */}
          <div
            className="absolute rounded-full border animate-spin-rev"
            style={{
              inset: 6,
              borderColor: 'rgba(168,85,247,0.20)',
              borderBottomColor: 'rgba(168,85,247,0.55)',
              borderWidth: 1,
            }}
          />
          {/* Core */}
          <div
            className="absolute animate-breathe"
            style={{
              inset: 12,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,200,255,0.9) 0%, rgba(0,200,255,0.4) 60%, transparent 100%)',
              boxShadow: '0 0 12px rgba(0,200,255,0.8)',
            }}
          />
        </div>

        <div>
          <h1 className="text-hero animate-glitch" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', letterSpacing: '-0.04em' }}>
            HOME.AI
          </h1>
          <div className="text-micro" style={{ marginTop: 1, color: 'rgba(100,160,220,0.5)', letterSpacing: '0.30em' }}>
            HYPER-OPERATIONAL META ENGINE
          </div>
        </div>
      </div>

      {/* ── CENTER: STATUS PILLS ── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,255,140,0.06)',
            border: '1px solid rgba(0,255,140,0.20)',
            boxShadow: '0 0 16px rgba(0,255,140,0.08)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-breathe"
            style={{ background: '#00ff8c', boxShadow: '0 0 8px #00ff8c' }}
          />
          <span className="text-micro" style={{ color: '#00ff8c', letterSpacing: '0.2em' }}>ALL SYSTEMS NOMINAL</span>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.18)' }}
        >
          <span className="text-micro" style={{ color: 'rgba(0,200,255,0.7)' }}>THREAT LEVEL</span>
          <span className="text-micro" style={{ color: '#00c8ff', fontWeight: 700 }}>ZERO</span>
        </div>
      </div>

      {/* ── RIGHT: LIVE METRICS ── */}
      <div className="flex items-center gap-6">
        {/* Throughput with sparkline */}
        <div className="flex items-end gap-3">
          <div className="text-right">
            <div className="text-label" style={{ fontSize: 8 }}>Throughput</div>
            <div
              className="font-mono glow-cyan"
              style={{ fontSize: 14, fontWeight: 700, color: '#00c8ff', lineHeight: 1.2, marginTop: 2 }}
            >
              {metrics.throughput.toFixed(2)}
              <span style={{ fontSize: 9, color: 'rgba(0,200,255,0.6)', marginLeft: 2 }}>GB/s</span>
            </div>
          </div>
          <SparkLine color="#00c8ff" values={throughputHistory} width={52} height={22} />
        </div>

        <div
          className="w-px self-stretch"
          style={{ background: 'rgba(0,200,255,0.12)' }}
        />

        {/* Latency with sparkline */}
        <div className="flex items-end gap-3">
          <div className="text-right">
            <div className="text-label" style={{ fontSize: 8 }}>Latency</div>
            <div
              className="font-mono"
              style={{
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.2,
                marginTop: 2,
                color: metrics.latency > 100 ? '#ff3c5f' : metrics.latency > 60 ? '#f0b429' : '#00ff8c',
              }}
            >
              {metrics.latency.toFixed(0)}
              <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 2 }}>ms</span>
            </div>
          </div>
          <SparkLine
            color={metrics.latency > 100 ? '#ff3c5f' : metrics.latency > 60 ? '#f0b429' : '#00ff8c'}
            values={latencyHistory}
            width={52}
            height={22}
          />
        </div>

        <div
          className="w-px self-stretch"
          style={{ background: 'rgba(0,200,255,0.12)' }}
        />

        {/* Uptime */}
        <div className="text-right">
          <div className="text-label" style={{ fontSize: 8 }}>Uptime</div>
          <div
            className="font-mono glow-gold"
            style={{ fontSize: 14, fontWeight: 700, color: '#f0b429', lineHeight: 1.2, marginTop: 2, letterSpacing: '0.05em' }}
          >
            {formatUptime(uptimeSeconds)}
          </div>
        </div>

        <div
          className="w-px self-stretch"
          style={{ background: 'rgba(0,200,255,0.12)' }}
        />

        {/* Connections */}
        <div className="text-right">
          <div className="text-label" style={{ fontSize: 8 }}>Connections</div>
          <div
            className="font-mono"
            style={{ fontSize: 14, fontWeight: 700, color: '#a855f7', lineHeight: 1.2, marginTop: 2 }}
          >
            {metrics.activeConnections}
          </div>
        </div>
      </div>
    </header>
  )
}
