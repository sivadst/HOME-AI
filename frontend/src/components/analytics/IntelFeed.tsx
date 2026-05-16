'use client'

import React, { useMemo } from 'react'
import { useStore } from '@/lib/store'

export function IntelFeed() {
  const { activities } = useStore()

  const criticalCount = useMemo(() => activities.filter(a => a.severity === 'critical').length, [activities])
  const warningCount = useMemo(() => activities.filter(a => a.severity === 'warning').length, [activities])

  return (
    <div
      className="flex flex-col overflow-hidden relative"
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
        <span className="text-label">Intel Feed</span>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span className="tag badge-critical">{criticalCount} CRITICAL</span>
          )}
          {warningCount > 0 && (
            <span className="tag badge-warning">{warningCount} WARN</span>
          )}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            Awaiting system events...
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  )
}

function ActivityItem({ activity }: any) {
  const severityColors = {
    info: 'rgba(0, 200, 255, 0.1)',
    warning: 'rgba(240, 180, 41, 0.1)',
    critical: 'rgba(255, 60, 95, 0.1)',
  }

  const severityBorders = {
    info: 'rgba(0, 200, 255, 0.3)',
    warning: 'rgba(240, 180, 41, 0.3)',
    critical: 'rgba(255, 60, 95, 0.5)',
  }

  return (
    <div
      className="p-2.5 rounded-md border text-xs space-y-1"
      style={{
        background: severityColors[activity.severity],
        borderColor: severityBorders[activity.severity],
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-label">{activity.type.toUpperCase()}</span>
        <span className="text-text-muted">{new Date(activity.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="text-text-primary">{activity.message}</div>
      <div className="text-text-muted">{activity.agent}</div>
    </div>
  )
}
