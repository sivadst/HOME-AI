'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import { useStore, type Activity } from '@/lib/store'

const SEVERITY_CONFIG = {
  info:     { color: '#00c8ff', border: 'rgba(0,200,255,0.25)',   bg: 'rgba(0,200,255,0.04)',  glyph: '◆', label: 'INFO' },
  warning:  { color: '#f0b429', border: 'rgba(240,180,41,0.28)',  bg: 'rgba(240,180,41,0.05)', glyph: '▲', label: 'WARN' },
  critical: { color: '#ff3c5f', border: 'rgba(255,60,95,0.38)',   bg: 'rgba(255,60,95,0.06)',  glyph: '✕', label: 'CRIT' },
} as const

const TYPE_COLORS: Record<string, string> = {
  process: '#00c8ff',
  alert:   '#ff3c5f',
  metric:  '#a855f7',
  event:   '#00ff8c',
}

function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const cfg = SEVERITY_CONFIG[activity.severity]
  const typeColor = TYPE_COLORS[activity.type] ?? '#00c8ff'

  return (
    <div
      className="animate-activity rounded-xl overflow-hidden relative"
      style={{
        animationDelay: `${Math.min(index * 30, 200)}ms`,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: activity.severity === 'critical'
          ? `0 2px 16px rgba(255,60,95,0.12), inset 0 0 12px rgba(255,60,95,0.04)`
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Severity accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
        style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}80` }}
      />

      <div className="pl-4 pr-3 py-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className="text-micro font-bold animate-flicker"
              style={{ color: cfg.color, fontSize: 8 }}
            >
              {cfg.glyph}
            </span>
            <span
              className="tag"
              style={{
                background: `${typeColor}12`,
                border: `1px solid ${typeColor}25`,
                color: typeColor,
                fontSize: 7,
                padding: '1px 6px',
              }}
            >
              {activity.type.toUpperCase()}
            </span>
            <span
              className="tag"
              style={{
                background: `${cfg.color}10`,
                border: `1px solid ${cfg.color}20`,
                color: cfg.color,
                fontSize: 7,
                padding: '1px 6px',
              }}
            >
              {cfg.label}
            </span>
          </div>
          <span className="text-micro" style={{ fontSize: 7 }}>
            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Message */}
        <div
          className="font-mono text-xs leading-snug mb-1"
          style={{ color: 'rgba(220,240,255,0.85)', fontSize: 10 }}
        >
          {activity.message}
        </div>

        {/* Agent tag */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: typeColor, boxShadow: `0 0 6px ${typeColor}` }}
          />
          <span className="text-micro" style={{ color: 'rgba(100,160,220,0.5)', fontSize: 7 }}>
            {activity.agent}
          </span>
        </div>
      </div>
    </div>
  )
}

/* Mini donut ring showing severity distribution */
function SeverityRing({ info, warning, critical }: { info: number; warning: number; critical: number }) {
  const total = info + warning + critical || 1
  const r = 20
  const circ = 2 * Math.PI * r
  const infoPct    = (info    / total) * circ
  const warnPct    = (warning / total) * circ
  // const critPct = (critical / total) * circ
  const infoOffset  = 0
  const warnOffset  = -infoPct
  const critOffset  = -(infoPct + warnPct)

  return (
    <div className="relative flex-shrink-0">
      <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
        {info > 0 && (
          <circle cx={24} cy={24} r={r} fill="none" stroke="#00c8ff"
            strokeWidth={4} strokeDasharray={`${infoPct} ${circ - infoPct}`}
            strokeDashoffset={infoOffset}
            style={{ filter: 'drop-shadow(0 0 4px #00c8ff)' }}
          />
        )}
        {warning > 0 && (
          <circle cx={24} cy={24} r={r} fill="none" stroke="#f0b429"
            strokeWidth={4} strokeDasharray={`${warnPct} ${circ - warnPct}`}
            strokeDashoffset={warnOffset}
            style={{ filter: 'drop-shadow(0 0 4px #f0b429)' }}
          />
        )}
        {critical > 0 && (
          <circle cx={24} cy={24} r={r} fill="none" stroke="#ff3c5f"
            strokeWidth={4}
            strokeDasharray={`${(critical / total) * circ} ${circ - (critical / total) * circ}`}
            strokeDashoffset={critOffset}
            style={{ filter: 'drop-shadow(0 0 4px #ff3c5f)' }}
          />
        )}
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono font-bold"
        style={{ fontSize: 11, color: 'rgba(180,220,255,0.8)', transform: 'rotate(0deg)' }}
      >
        {info + warning + critical}
      </div>
    </div>
  )
}

export function IntelFeed() {
  const activities = useStore(s => s.activities)
  const listRef    = useRef<HTMLDivElement>(null)

  const infoCount     = useMemo(() => activities.filter(a => a.severity === 'info').length, [activities])
  const warningCount  = useMemo(() => activities.filter(a => a.severity === 'warning').length, [activities])
  const criticalCount = useMemo(() => activities.filter(a => a.severity === 'critical').length, [activities])

  // Auto-scroll to top when new activity arrives
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [activities.length])

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(2,5,12,0.98) 0%, rgba(4,9,20,0.96) 100%)',
        borderLeft: '1px solid rgba(0,200,255,0.08)',
      }}
    >
      {/* Depth effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 35% at 50% 0%, rgba(255,60,95,0.03) 0%, transparent 70%)' }}
      />
      <div className="scanline-overlay" style={{ opacity: 0.3 }} />

      {/* ── HEADER ── */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(0,200,255,0.10)',
          background: 'rgba(1,3,8,0.92)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-px h-3" style={{ background: '#ff3c5f', boxShadow: '0 0 8px #ff3c5f' }} />
            <span className="text-section" style={{ color: 'rgba(220,180,255,0.9)' }}>Intel Feed</span>
          </div>
          {criticalCount > 0 && (
            <span className="tag badge-critical animate-breathe">{criticalCount} CRIT</span>
          )}
        </div>

        {/* Severity distribution */}
        <div className="flex items-center gap-4">
          <SeverityRing info={infoCount} warning={warningCount} critical={criticalCount} />
          <div className="flex-1 space-y-1.5">
            {[
              { label: 'INFO',  count: infoCount,    color: '#00c8ff' },
              { label: 'WARN',  count: warningCount, color: '#f0b429' },
              { label: 'CRIT',  count: criticalCount, color: '#ff3c5f' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-micro w-7" style={{ color }}>{label}</span>
                <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: activities.length ? `${(count / activities.length) * 100}%` : '0%',
                      background: color,
                      boxShadow: `0 0 6px ${color}80`,
                    }}
                  />
                </div>
                <span className="font-mono" style={{ fontSize: 9, color, width: 16, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACTIVITY STREAM ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
      >
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <div
              className="w-8 h-8 rounded-full animate-pulse-ring"
              style={{ border: '1px solid rgba(0,200,255,0.4)' }}
            />
            <span className="text-label">Awaiting events...</span>
          </div>
        ) : (
          activities.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))
        )}
      </div>

      {/* ── FOOTER STATUS ── */}
      <div
        className="px-5 py-3 flex-shrink-0"
        style={{
          borderTop: '1px solid rgba(0,200,255,0.08)',
          background: 'rgba(1,3,8,0.92)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-breathe"
              style={{ background: '#00ff8c', boxShadow: '0 0 6px #00ff8c' }}
            />
            <span className="text-micro">STREAM LIVE</span>
          </div>
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(100,160,220,0.5)' }}>
            {activities.length} / 50 events
          </span>
        </div>
      </div>
    </div>
  )
}
