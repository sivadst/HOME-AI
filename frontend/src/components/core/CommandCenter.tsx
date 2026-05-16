'use client'

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useStore } from '@/lib/store'

/* ── Animated SVG Neural Graph ── */
function NeuralGraph({ series }: { series: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    ctx.clearRect(0, 0, w, h)

    if (series.length < 2) return
    const min = Math.min(...series)
    const max = Math.max(...series)
    const range = Math.max(max - min, 1)
    const step  = w / (series.length - 1)
    const pts   = series.map((v, i) => ({
      x: i * step,
      y: h - ((v - min) / range) * h * 0.82 - h * 0.09,
    }))

    // Area fill
    const fill = ctx.createLinearGradient(0, 0, 0, h)
    fill.addColorStop(0, 'rgba(0,200,255,0.30)')
    fill.addColorStop(0.6, 'rgba(0,200,255,0.08)')
    fill.addColorStop(1, 'rgba(0,200,255,0)')
    ctx.beginPath()
    ctx.moveTo(pts[0].x, h)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length - 1].x, h)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()

    // Second series (phase-shifted) for depth
    const pts2 = series.map((v, i) => ({
      x: i * step,
      y: h - ((v * 0.7 + 15 - min) / range) * h * 0.82 - h * 0.09,
    }))
    const fill2 = ctx.createLinearGradient(0, 0, 0, h)
    fill2.addColorStop(0, 'rgba(168,85,247,0.18)')
    fill2.addColorStop(1, 'rgba(168,85,247,0)')
    ctx.beginPath()
    ctx.moveTo(pts2[0].x, h)
    pts2.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts2[pts2.length - 1].x, h)
    ctx.closePath()
    ctx.fillStyle = fill2
    ctx.fill()

    // Primary line
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = '#00c8ff'
    ctx.lineWidth = 1.8
    ctx.shadowBlur = 12
    ctx.shadowColor = '#00c8ff'
    ctx.stroke()
    ctx.shadowBlur = 0

    // Secondary line
    ctx.beginPath()
    pts2.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = 'rgba(168,85,247,0.7)'
    ctx.lineWidth = 1.2
    ctx.shadowBlur = 8
    ctx.shadowColor = '#a855f7'
    ctx.stroke()
    ctx.shadowBlur = 0

    // Grid lines
    ctx.setLineDash([2, 6])
    ctx.lineWidth = 0.5
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i
      ctx.strokeStyle = 'rgba(0,200,255,0.08)'
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Live point
    const last = pts[pts.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = '#00c8ff'
    ctx.shadowBlur = 18
    ctx.shadowColor = '#00c8ff'
    ctx.fill()
    ctx.shadowBlur = 0
  }, [series])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

/* ── Central AI Holographic Core ── */
function HolographicCore({ efficiency }: { efficiency: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outermost ambient ring */}
      <div
        className="absolute rounded-full animate-orbit-slow"
        style={{
          width: 190, height: 190,
          border: '1px dashed rgba(0,200,255,0.08)',
        }}
      />
      {/* Orbit ring 3 */}
      <div
        className="absolute rounded-full animate-orbit-cw"
        style={{
          width: 170, height: 170,
          border: '1px solid rgba(0,200,255,0.14)',
          borderTopColor: 'rgba(0,200,255,0.55)',
          boxShadow: '0 0 20px rgba(0,200,255,0.06)',
        }}
      />
      {/* Orbit ring 2 */}
      <div
        className="absolute rounded-full animate-orbit-ccw"
        style={{
          width: 130, height: 130,
          border: '1px solid rgba(168,85,247,0.18)',
          borderLeftColor: 'rgba(168,85,247,0.60)',
          boxShadow: '0 0 16px rgba(168,85,247,0.08)',
        }}
      />
      {/* Orbit ring 1 */}
      <div
        className="absolute rounded-full animate-orbit-med"
        style={{
          width: 95, height: 95,
          border: '1px solid rgba(0,255,140,0.18)',
          borderRightColor: 'rgba(0,255,140,0.55)',
        }}
      />

      {/* Orbiting nodes */}
      <div className="absolute animate-orbit-cw" style={{ width: 170, height: 170 }}>
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: -4, left: '50%', marginLeft: -4,
            background: '#00c8ff',
            boxShadow: '0 0 12px #00c8ff, 0 0 24px rgba(0,200,255,0.5)',
          }}
        />
      </div>
      <div className="absolute animate-orbit-ccw" style={{ width: 130, height: 130 }}>
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            bottom: -4, left: '50%', marginLeft: -4,
            background: '#a855f7',
            boxShadow: '0 0 12px #a855f7, 0 0 24px rgba(168,85,247,0.5)',
          }}
        />
      </div>
      <div className="absolute animate-orbit-med" style={{ width: 95, height: 95 }}>
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            top: -3, right: -3,
            background: '#00ff8c',
            boxShadow: '0 0 10px #00ff8c',
          }}
        />
      </div>

      {/* Core glow layers */}
      <div
        className="absolute rounded-full animate-pulse-ring"
        style={{
          width: 64, height: 64,
          border: '1px solid rgba(0,200,255,0.3)',
          boxShadow: '0 0 30px rgba(0,200,255,0.15)',
        }}
      />
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          width: 48, height: 48,
          background: 'radial-gradient(circle, rgba(0,200,255,0.35) 0%, rgba(0,200,255,0.12) 50%, transparent 100%)',
          boxShadow: '0 0 40px rgba(0,200,255,0.25)',
        }}
      />

      {/* Inner core */}
      <div
        className="relative flex items-center justify-center rounded-full z-10"
        style={{
          width: 36, height: 36,
          background: 'radial-gradient(circle, rgba(0,200,255,0.9) 0%, rgba(0,200,255,0.4) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0,200,255,0.8), 0 0 60px rgba(0,200,255,0.3)',
        }}
      >
        <span className="font-mono text-white font-bold" style={{ fontSize: 9 }}>
          {efficiency.toFixed(0)}
        </span>
      </div>
    </div>
  )
}

/* ── Radial Gauge ── */
function RadialGauge({
  value, max = 100, label, color, size = 72,
}: {
  value: number; max?: number; label: string; color: string; size?: number
}) {
  const pct = Math.min(value / max, 1)
  const r   = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={3}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'rotate(0deg)' }}
        >
          <span className="font-mono font-bold" style={{ fontSize: 13, color, lineHeight: 1 }}>
            {value.toFixed(0)}
          </span>
          <span className="text-micro" style={{ fontSize: 7 }}>%</span>
        </div>
      </div>
      <div className="text-label" style={{ fontSize: 7, textAlign: 'center', maxWidth: size }}>{label}</div>
    </div>
  )
}

/* ── Floating Intelligence Card ── */
function IntelCard({
  title, value, unit, color, sub, delay = 0,
}: {
  title: string; value: string; unit?: string; color: string; sub?: string; delay?: number
}) {
  return (
    <div
      className="holographic panel-hover rounded-lg p-4 relative overflow-hidden animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: `${color}25`,
        background: `linear-gradient(135deg, rgba(8,18,40,0.7) 0%, ${color}08 100%)`,
        boxShadow: `0 4px 24px ${color}10, inset 0 0 20px ${color}04`,
      }}
    >
      <div className="scanline-overlay" />
      <div className="text-label mb-2" style={{ color: `${color}99` }}>{title}</div>
      <div className="flex items-end gap-1" style={{ position: 'relative', zIndex: 2 }}>
        <span
          className="font-mono font-bold animate-flicker"
          style={{ fontSize: 24, color, lineHeight: 1, textShadow: `0 0 20px ${color}80` }}
        >
          {value}
        </span>
        {unit && <span className="font-mono" style={{ fontSize: 10, color: `${color}70`, marginBottom: 3 }}>{unit}</span>}
      </div>
      {sub && <div className="text-micro mt-1" style={{ position: 'relative', zIndex: 2 }}>{sub}</div>}
      {/* corner accent */}
      <div
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          background: `linear-gradient(225deg, ${color}20, transparent)`,
          borderBottom: `1px solid ${color}30`,
          borderLeft: `1px solid ${color}30`,
        }}
      />
    </div>
  )
}

/* ── Neural Activity Bars ── */
function NeuralBars({ series }: { series: number[] }) {
  const bars = series.slice(-32)
  return (
    <div className="flex items-end gap-0.5 h-full w-full">
      {bars.map((v, i) => {
        const hue = v > 70 ? '#00c8ff' : v > 40 ? '#a855f7' : '#00ff8c'
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-500"
            style={{
              height: `${Math.max(8, v)}%`,
              background: `linear-gradient(180deg, ${hue} 0%, ${hue}44 100%)`,
              boxShadow: i === bars.length - 1 ? `0 0 8px ${hue}` : 'none',
              opacity: 0.5 + (i / bars.length) * 0.5,
            }}
          />
        )
      })}
    </div>
  )
}

/* ── Section Header ── */
function SectionHeader({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-px h-3" style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
        <span className="text-section" style={{ color: 'rgba(0,200,255,0.8)' }}>{label}</span>
      </div>
      {badge && <span className="tag badge-live">{badge}</span>}
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN COMMAND CENTER
══════════════════════════════════════════════ */
export function CommandCenter() {
  const { metrics, agents, neuralSeries } = useStore()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const avgEfficiency = useMemo(
    () => agents.reduce((s, a) => s + a.efficiency, 0) / agents.length,
    [agents]
  )

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(3,8,18,0.97) 0%, rgba(5,12,24,0.95) 100%)',
      }}
    >
      {/* Background depth layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,200,255,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="scanline-overlay" style={{ opacity: 0.4 }} />
      <div className="scanline-drift" />

      {/* ── PANEL HEADER ── */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(0,200,255,0.10)',
          background: 'rgba(2,6,14,0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full animate-breathe"
            style={{ background: '#00ff8c', boxShadow: '0 0 8px #00ff8c' }}
          />
          <span className="text-section">Command Center</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tag badge-live">LIVE</span>
          <span className="text-micro" style={{ color: 'rgba(0,200,255,0.4)' }}>
            T+{tick}s
          </span>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* ═══ ROW 1: HOLOGRAPHIC CORE + NEURAL GRAPH ═══ */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '200px 1fr' }}>

          {/* AI Core */}
          <div
            className="holographic rounded-xl flex flex-col items-center justify-center py-6 gap-3"
            style={{ minHeight: 220 }}
          >
            <HolographicCore efficiency={avgEfficiency} />
            <div className="text-center">
              <div className="text-label">Neural Core</div>
              <div className="font-mono glow-cyan" style={{ fontSize: 11, color: '#00c8ff', marginTop: 2 }}>
                {avgEfficiency.toFixed(1)}% EFF
              </div>
            </div>
          </div>

          {/* Neural performance graph */}
          <div
            className="holographic rounded-xl flex flex-col"
            style={{ minHeight: 220 }}
          >
            <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
              <SectionHeader label="Neural Performance" />
              <div className="flex gap-2 items-center">
                <span className="text-micro" style={{ color: 'rgba(0,200,255,0.6)' }}>
                  LIVE · {neuralSeries[neuralSeries.length - 1]?.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex-1 px-2 pb-2" style={{ minHeight: 0 }}>
              <NeuralGraph series={neuralSeries} />
            </div>
          </div>
        </div>

        {/* ═══ ROW 2: INTEL CARDS ═══ */}
        <div className="grid grid-cols-2 gap-3">
          <IntelCard
            title="CPU UTILIZATION"
            value={metrics.cpuUsage.toFixed(0)}
            unit="%"
            color="#00c8ff"
            sub={`${metrics.activeConnections} active threads`}
            delay={0}
          />
          <IntelCard
            title="MEMORY LOAD"
            value={metrics.memoryUsage.toFixed(0)}
            unit="%"
            color="#a855f7"
            sub="Heap allocated"
            delay={80}
          />
          <IntelCard
            title="THROUGHPUT"
            value={metrics.throughput.toFixed(2)}
            unit="GB/s"
            color="#00ff8c"
            sub="Network I/O aggregate"
            delay={160}
          />
          <IntelCard
            title="LATENCY"
            value={metrics.latency.toFixed(0)}
            unit="ms"
            color={metrics.latency > 100 ? '#ff3c5f' : '#f0b429'}
            sub="P99 response time"
            delay={240}
          />
        </div>

        {/* ═══ ROW 3: RADIAL GAUGES ═══ */}
        <div
          className="holographic rounded-xl p-5"
        >
          <SectionHeader label="System Health Matrix" badge="MONITORING" />
          <div className="flex items-center justify-around">
            <RadialGauge value={metrics.cpuUsage}    label="CPU"     color="#00c8ff"  />
            <RadialGauge value={metrics.memoryUsage} label="MEMORY"  color="#a855f7"  />
            <RadialGauge value={avgEfficiency}        label="AI EFF"  color="#00ff8c"  />
            <RadialGauge value={Math.min(metrics.activeConnections / 5, 100)} label="CONNS" color="#f0b429" />
          </div>
        </div>

        {/* ═══ ROW 4: NEURAL ACTIVITY BARS ═══ */}
        <div className="holographic rounded-xl p-4" style={{ height: 120 }}>
          <div className="flex items-center justify-between mb-2">
            <SectionHeader label="Neural Activity Pulse" />
            <span className="text-micro" style={{ color: 'rgba(0,200,255,0.5)' }}>32-FRAME WINDOW</span>
          </div>
          <div style={{ height: 70 }}>
            <NeuralBars series={neuralSeries} />
          </div>
        </div>

        {/* ═══ ROW 5: AGENT PROCESS GRID ═══ */}
        <div className="holographic rounded-xl p-4">
          <SectionHeader label="Agent Process Matrix" badge={`${agents.length} UNITS`} />
          <div className="space-y-2">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{
                  background: `${agent.color}08`,
                  border: `1px solid ${agent.color}20`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-breathe flex-shrink-0"
                  style={{ background: agent.color, boxShadow: `0 0 8px ${agent.color}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold" style={{ color: agent.color }}>{agent.name}</span>
                    <span className="text-micro">{agent.efficiency.toFixed(0)}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${agent.efficiency}%`,
                        background: `linear-gradient(90deg, ${agent.color}66, ${agent.color})`,
                        boxShadow: `0 0 8px ${agent.color}66`,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="tag flex-shrink-0"
                  style={{
                    background: `${agent.color}15`,
                    border: `1px solid ${agent.color}30`,
                    color: agent.color,
                    fontSize: 7,
                  }}
                >
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
