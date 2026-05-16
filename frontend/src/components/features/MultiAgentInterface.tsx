'use client'

import React from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MultiAgentInterface() {
  const agents = useStore((s) => s.agents)
  const setSelected = useStore((s) => s.setSelectedAgent)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-label">Multi-Agent Intelligence</h3>
        <div className="text-[12px] text-text-muted">{agents.length} units</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className={cn('p-3 rounded-md border glass', 'interactive')}
            style={{ borderColor: 'var(--border)' }}
            onClick={() => setSelected(agent.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ background: `${agent.color}22` }}>
                <div className="text-sm font-bold" style={{ color: agent.color }}>●</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold truncate" style={{ color: agent.color }}>{agent.name}</div>
                  <div className="text-[12px] text-text-muted">{agent.processCount} proc</div>
                </div>
                <div className="text-[12px] text-text-muted mt-1">Status: <span style={{ color: 'var(--text-primary)' }}>{agent.status}</span></div>
                <div className="mt-3 h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${agent.efficiency}%`, background: `linear-gradient(90deg, ${agent.color}88, ${agent.color})` }} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
