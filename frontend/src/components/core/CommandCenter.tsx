'use client'

import React, { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function CommandCenter() {
  const { metrics, agents } = useStore()

  const avgEfficiency = useMemo(
    () => agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length,
    [agents]
  )

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{ background: 'var(--surface)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <span className="text-label">Command Center</span>
        <span className="tag badge-live">LIVE</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Neural Network Visualization */}
        <div>
          <div className="text-label mb-4">Neural Performance</div>
          <div className="space-y-3">
            {/* Network nodes simulation */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md border"
                  style={{
                    background: `rgba(0, 200, 255, ${0.1 + Math.random() * 0.3})`,
                    borderColor: `rgba(0, 200, 255, ${0.2 + Math.random() * 0.3})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* System Efficiency */}
        <div>
          <div className="text-label mb-4">Average Efficiency</div>
          <div className="relative h-8 rounded-md overflow-hidden" style={{ background: 'var(--glass)' }}>
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${avgEfficiency}%`,
                background: 'linear-gradient(90deg, rgba(0, 200, 255, 0.5), rgba(0, 255, 140, 0.5))',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-label">
              {avgEfficiency.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="CPU Usage" value={`${metrics.cpuUsage.toFixed(0)}%`} />
          <MetricCard label="Memory Usage" value={`${metrics.memoryUsage.toFixed(0)}%`} />
          <MetricCard label="Connections" value={metrics.activeConnections.toFixed(0)} />
          <MetricCard label="Latency" value={`${metrics.latency.toFixed(0)}ms`} />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-4 rounded-md border"
      style={{
        background: 'var(--glass)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="text-label mb-2">{label}</div>
      <div className="text-value text-lg glow-cyan">{value}</div>
    </div>
  )
}
