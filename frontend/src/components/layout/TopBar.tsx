'use client'

import React from 'react'
import { useStore } from '@/lib/store'

export function TopBar() {
  const { uptimeSeconds, metrics } = useStore()

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div
      className="flex items-center justify-between px-8 py-4 relative z-20"
      style={{
        background: 'var(--deep)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex-1">
        <h1 className="text-hero glow-cyan">HOME.AI</h1>
        <p className="text-label">Hyper-Operational Meta Engine</p>
      </div>

      <div className="flex items-center gap-8 text-right">
        {/* System Status */}
        <div>
          <div className="text-label">System Status</div>
          <div className="text-value glow-gold">OPERATIONAL</div>
        </div>

        {/* Uptime */}
        <div>
          <div className="text-label">Uptime</div>
          <div className="text-value font-mono">{formatUptime(uptimeSeconds)}</div>
        </div>

        {/* Metrics */}
        <div>
          <div className="text-label">Throughput</div>
          <div className="text-value text-cyan">{metrics.throughput.toFixed(1)}GB/s</div>
        </div>
        <div>
          <div className="text-label">Latency</div>
          <div className="text-value">{metrics.latency.toFixed(0)}ms</div>
        </div>
      </div>
    </div>
  )
}
