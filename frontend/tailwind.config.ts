import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--void)',
        deep: 'var(--deep)',
        surface: 'var(--surface)',
        cyan: 'var(--cyan)',
        gold: 'var(--gold)',
        green: 'var(--green)',
        red: 'var(--red)',
        purple: 'var(--purple)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)',
        'border-subtle': 'var(--border-subtle)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        mono: 'var(--font-mono)',
      },
      backgroundColor: {
        glass: 'var(--glass)',
        'glass-heavy': 'var(--glass-heavy)',
      },
    },
  },
  plugins: [],
}

export default config

