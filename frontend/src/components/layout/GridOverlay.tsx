'use client'

import React from 'react'

export function GridOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(0, 200, 255, 0.05) 25%, rgba(0, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 200, 255, 0.05) 75%, rgba(0, 200, 255, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0, 200, 255, 0.05) 25%, rgba(0, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 200, 255, 0.05) 75%, rgba(0, 200, 255, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  )
}
