'use client'

import React from 'react'

export function GridOverlay() {
  return (
    <>
      {/* Subtle perspective grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0,200,255,0.025) 25%, rgba(0,200,255,0.025) 26%, transparent 27%, transparent 74%, rgba(0,200,255,0.025) 75%, rgba(0,200,255,0.025) 76%, transparent 77%),
            linear-gradient(90deg, transparent 24%, rgba(0,200,255,0.025) 25%, rgba(0,200,255,0.025) 26%, transparent 27%, transparent 74%, rgba(0,200,255,0.025) 75%, rgba(0,200,255,0.025) 76%, transparent 77%)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }}
      />

      {/* Global atmospheric radial glow at center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 50% 40% at 50% 35%, rgba(0,200,255,0.025) 0%, transparent 100%),
            radial-gradient(ellipse 30% 25% at 30% 60%, rgba(168,85,247,0.015) 0%, transparent 100%),
            radial-gradient(ellipse 30% 25% at 70% 70%, rgba(0,255,140,0.012) 0%, transparent 100%)
          `,
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(1,3,7,0.6) 100%)',
        }}
      />
    </>
  )
}
