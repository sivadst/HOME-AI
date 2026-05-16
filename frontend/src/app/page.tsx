'use client'

import { useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { AgentSidebar } from '@/components/agents/AgentSidebar'
import { CommandCenter } from '@/components/core/CommandCenter'
import { IntelFeed } from '@/components/analytics/IntelFeed'
import { useStore, generateActivity } from '@/lib/store'

export default function HomePage() {
  const { updateAgentMetrics, updateMetrics, appendNeuralPoint, addActivity, incrementUptime } = useStore()

  useEffect(() => {
    // Agent metrics ticker
    const agentTimer = setInterval(updateAgentMetrics, 3000)
    // Global metrics ticker
    const metricTimer = setInterval(updateMetrics, 2000)
    // Neural series
    const neuralTimer = setInterval(appendNeuralPoint, 2500)
    // Activity stream
    const activityTimer = setInterval(() => addActivity(generateActivity()), 4000)
    // Uptime
    const uptimeTimer = setInterval(incrementUptime, 1000)

    // Seed initial activities
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addActivity(generateActivity()), i * 200)
    }

    return () => {
      clearInterval(agentTimer)
      clearInterval(metricTimer)
      clearInterval(neuralTimer)
      clearInterval(activityTimer)
      clearInterval(uptimeTimer)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <div
        className="flex-1 grid overflow-hidden"
        style={{
          gridTemplateColumns: '280px 1fr 300px',
          background: 'var(--border)',
          gap: '1px',
        }}
      >
        <AgentSidebar />
        <CommandCenter />
        <IntelFeed />
      </div>
    </div>
  )
}
