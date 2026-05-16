'use client'

import { useEffect, useRef } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { AgentSidebar } from '@/components/agents/AgentSidebar'
import { CommandCenter } from '@/components/core/CommandCenter'
import { IntelFeed } from '@/components/analytics/IntelFeed'
import { useStore, generateActivity } from '@/lib/store'

export default function HomePage() {
  const updateAgentMetrics = useStore(s => s.updateAgentMetrics)
  const updateMetrics      = useStore(s => s.updateMetrics)
  const appendNeuralPoint  = useStore(s => s.appendNeuralPoint)
  const addActivity        = useStore(s => s.addActivity)
  const incrementUptime    = useStore(s => s.incrementUptime)

  // Track refs for cleanup safety
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Agent metrics ticker
    const agentTimer    = setInterval(updateAgentMetrics, 3000)
    // Global metrics ticker
    const metricTimer   = setInterval(updateMetrics, 2000)
    // Neural series — faster for smoother chart animation
    const neuralTimer   = setInterval(appendNeuralPoint, 1800)
    // Activity stream
    const activityTimer = setInterval(() => addActivity(generateActivity()), 3500)
    // Uptime
    const uptimeTimer   = setInterval(incrementUptime, 1000)

    // Seed initial activities for immediate visual density
    for (let i = 0; i < 8; i++) {
      setTimeout(() => addActivity(generateActivity()), i * 150)
    }

    return () => {
      clearInterval(agentTimer)
      clearInterval(metricTimer)
      clearInterval(neuralTimer)
      clearInterval(activityTimer)
      clearInterval(uptimeTimer)
    }
  }, [updateAgentMetrics, updateMetrics, appendNeuralPoint, addActivity, incrementUptime])

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{ zIndex: 10 }}
    >
      <TopBar />

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div
        className="flex-1 grid overflow-hidden"
        style={{
          gridTemplateColumns: '260px 1fr 280px',
          gap: 0,
        }}
      >
        <AgentSidebar />
        <CommandCenter />
        <IntelFeed />
      </div>
    </div>
  )
}
