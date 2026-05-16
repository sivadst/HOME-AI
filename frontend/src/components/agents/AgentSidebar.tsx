'use client'

import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function AgentSidebar() {
  const agents = useStore((state) => state.agents)
  const selectedAgentId = useStore((state) => state.selectedAgentId)
  const setSelectedAgent = useStore((state) => state.setSelectedAgent)

  return (
    <aside
      className="flex flex-col overflow-hidden"
      style={{ background: 'var(--deep)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--deep)',
        }}
      >
        <span className="text-label">AI Civilization</span>
        <span className="tag badge-live">{agents.length} AGENTS</span>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId
          const statusColors = {
            active: 'var(--green)',
            idle: 'var(--text-muted)',
            processing: 'var(--cyan)',
          }
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={cn(
                'w-full text-left p-3.5 rounded-md transition-all duration-250 relative overflow-hidden group',
                'border',
                isSelected
                  ? 'border-[color:var(--border-bright)]'
                  : 'border-[color:var(--border)] hover:border-[color:var(--border-bright)]'
              )}
              style={{
                background: isSelected
                  ? `${agent.color}08`
                  : 'var(--glass)',
              }}
            >
              {/* Hover shimmer */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, transparent 60%, ${agent.color}22)`,
                }}
              />

              {/* Agent header */}
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: `${agent.color}22` }}
                >
                  ●
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-xs font-bold tracking-wide truncate"
                    style={{ color: agent.color }}
                  >
                    {agent.name}
                  </div>
                  <div
                    className="text-[10px] font-mono truncate"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {agent.status}
                  </div>
                </div>
              </div>

              {/* Status line */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[9px] tracking-[0.1em]"
                  style={{ color: statusColors[agent.status] }}
                >
                  ● {agent.status}
                </span>
                <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                  {agent.efficiency.toFixed(0)}% eff
                </span>
              </div>

              {/* Efficiency bar */}
              <div
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${agent.efficiency}%`,
                    background: `linear-gradient(90deg, ${agent.color}88, ${agent.color})`,
                  }}
                />
              </div>

              {/* Process count */}
              <div className="flex justify-between mt-2">
                <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                  Processes: {agent.processCount}
                </span>
                <span className="font-mono text-[9px]" style={{ color: agent.color }}>
                  {agent.efficiency.toFixed(1)}% cap
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* System health footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-label" style={{ fontSize: '9px' }}>System Health</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--green)' }}>
            99.97%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: '99.97%',
              background: 'linear-gradient(90deg, var(--green) 0%, #00ffbb 100%)',
              boxShadow: '0 0 8px var(--green)',
            }}
          />
        </div>
      </div>
    </aside>
  )
}
