'use client'

import React, { useMemo } from 'react'
import { useStore, type Agent } from '@/lib/store'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  active:     { color: '#00ff8c', label: 'ACTIVE',     glyph: '▲' },
  idle:       { color: '#f0b429', label: 'STANDBY',    glyph: '◈' },
  processing: { color: '#00c8ff', label: 'PROCESSING', glyph: '⟳' },
} as const

function AgentCard({ agent, isSelected, onClick }: { agent: Agent; isSelected: boolean; onClick: () => void }) {
  const status = STATUS_CONFIG[agent.status]

  return (
    <button
      onClick={onClick}
      className="w-full text-left panel-hover relative overflow-hidden rounded-xl transition-all duration-300"
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${agent.color}12 0%, rgba(8,18,40,0.9) 100%)`
          : 'rgba(5,12,24,0.65)',
        border: isSelected
          ? `1px solid ${agent.color}45`
          : '1px solid rgba(0,200,255,0.08)',
        boxShadow: isSelected
          ? `0 4px 28px ${agent.color}18, inset 0 0 20px ${agent.color}06`
          : '0 2px 12px rgba(0,0,0,0.3)',
        padding: '14px 14px 12px',
      }}
    >
      {/* Scanline on selected */}
      {isSelected && (
        <>
          <div className="scanline-overlay" style={{ opacity: 0.3 }} />
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${agent.color}80, transparent)` }}
          />
        </>
      )}

      {/* Shimmer hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, transparent 60%, ${agent.color}10)` }}
      />

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Agent avatar with pulsing rings */}
        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
          {isSelected && (
            <div
              className="absolute rounded-full animate-pulse-ring"
              style={{
                inset: -4,
                border: `1px solid ${agent.color}50`,
              }}
            />
          )}
          <div
            className="absolute inset-0 rounded-xl flex items-center justify-center text-base font-bold animate-breathe"
            style={{
              background: `radial-gradient(circle, ${agent.color}28 0%, ${agent.color}10 100%)`,
              border: `1px solid ${agent.color}35`,
              color: agent.color,
              boxShadow: `0 0 16px ${agent.color}30`,
            }}
          >
            {agent.name.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs font-bold truncate mb-0.5" style={{ color: agent.color }}>
            {agent.name}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-micro animate-flicker"
              style={{ color: status.color, fontSize: 8 }}
            >
              {status.glyph}
            </span>
            <span className="text-micro" style={{ color: status.color }}>{status.label}</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div
            className="font-mono font-bold"
            style={{ fontSize: 14, color: agent.color, lineHeight: 1, textShadow: `0 0 12px ${agent.color}80` }}
          >
            {agent.efficiency.toFixed(0)}
          </div>
          <div className="text-micro" style={{ fontSize: 7 }}>EFF%</div>
        </div>
      </div>

      {/* Efficiency bar */}
      <div className="mb-2.5">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${agent.efficiency}%`,
              background: `linear-gradient(90deg, ${agent.color}50, ${agent.color})`,
              boxShadow: `0 0 10px ${agent.color}60`,
            }}
          >
            {/* trailing glow */}
            <div
              className="absolute right-0 top-0 bottom-0 w-4 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${agent.color})` }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-micro" style={{ fontSize: 7 }}>Processes</div>
          <div className="font-mono" style={{ fontSize: 10, color: 'rgba(180,220,255,0.7)' }}>
            {agent.processCount.toLocaleString()}
          </div>
        </div>
        <div
          className="tag"
          style={{
            background: `${agent.color}12`,
            border: `1px solid ${agent.color}28`,
            color: agent.color,
            fontSize: 7,
          }}
        >
          {agent.id.toUpperCase()}
        </div>
      </div>
    </button>
  )
}

function SystemMetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(0,200,255,0.05)' }}>
      <span className="text-micro">{label}</span>
      <span className="font-mono text-xs" style={{ color }}>{value}</span>
    </div>
  )
}

export function AgentSidebar() {
  const agents         = useStore(s => s.agents)
  const selectedId     = useStore(s => s.selectedAgentId)
  const setSelected    = useStore(s => s.setSelectedAgent)
  const metrics        = useStore(s => s.metrics)

  const totalProcesses = useMemo(() => agents.reduce((sum, a) => sum + a.processCount, 0), [agents])
  const activeCount    = useMemo(() => agents.filter(a => a.status === 'active').length, [agents])

  return (
    <aside
      className="flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(2,6,14,0.98) 0%, rgba(4,10,22,0.96) 100%)',
        borderRight: '1px solid rgba(0,200,255,0.08)',
      }}
    >
      {/* Depth glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(0,200,255,0.04) 0%, transparent 70%)' }}
      />
      <div className="scanline-overlay" style={{ opacity: 0.3 }} />

      {/* ── HEADER ── */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(0,200,255,0.10)',
          background: 'rgba(1,4,10,0.90)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-px h-3" style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
            <span className="text-section" style={{ color: 'rgba(0,200,255,0.9)' }}>AI Civilization</span>
          </div>
          <span className="tag badge-live">{agents.length} UNITS</span>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded-lg px-3 py-2"
            style={{ background: 'rgba(0,255,140,0.06)', border: '1px solid rgba(0,255,140,0.15)' }}
          >
            <div className="text-micro" style={{ fontSize: 7 }}>Online</div>
            <div className="font-mono font-bold" style={{ fontSize: 16, color: '#00ff8c', lineHeight: 1.1 }}>
              {activeCount}
            </div>
          </div>
          <div
            className="rounded-lg px-3 py-2"
            style={{ background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)' }}
          >
            <div className="text-micro" style={{ fontSize: 7 }}>Processes</div>
            <div className="font-mono font-bold" style={{ fontSize: 13, color: '#00c8ff', lineHeight: 1.1 }}>
              {totalProcesses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ── AGENT LIST ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={agent.id === selectedId}
            onClick={() => setSelected(agent.id)}
          />
        ))}
      </div>

      {/* ── SYSTEM METRICS FOOTER ── */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{
          borderTop: '1px solid rgba(0,200,255,0.10)',
          background: 'rgba(1,4,10,0.90)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-px h-3" style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
          <span className="text-section" style={{ color: 'rgba(0,255,140,0.8)', fontSize: 9 }}>System Vitals</span>
        </div>

        <SystemMetricRow label="CPU USAGE"   value={`${metrics.cpuUsage.toFixed(0)}%`}  color="#00c8ff" />
        <SystemMetricRow label="MEMORY"      value={`${metrics.memoryUsage.toFixed(0)}%`} color="#a855f7" />
        <SystemMetricRow label="THROUGHPUT"  value={`${metrics.throughput.toFixed(1)} GB/s`} color="#00ff8c" />

        {/* Health bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-micro" style={{ fontSize: 7 }}>SYSTEM HEALTH</span>
            <span className="font-mono text-xs glow-green" style={{ color: '#00ff8c' }}>99.97%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full animate-breathe"
              style={{
                width: '99.97%',
                background: 'linear-gradient(90deg, #00ff8c66, #00ff8c)',
                boxShadow: '0 0 10px #00ff8c60',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
