import { create } from 'zustand'

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export interface Agent {
  id: string
  name: string
  status: 'active' | 'idle' | 'processing'
  efficiency: number
  color: string
  processCount: number
}

export interface Activity {
  id: string
  timestamp: number
  type: 'process' | 'alert' | 'metric' | 'event'
  agent: string
  message: string
  severity: 'info' | 'warning' | 'critical'
}

export interface GlobalMetrics {
  throughput: number
  latency: number
  cpuUsage: number
  memoryUsage: number
  activeConnections: number
}

export interface Store {
  // Agents
  agents: Agent[]
  selectedAgentId: string | null
  setSelectedAgent: (id: string) => void
  updateAgentStatus: (id: string, status: Agent['status']) => void
  updateAgentMetrics: () => void

  // Global Metrics
  metrics: GlobalMetrics
  updateMetrics: () => void

  // Neural data visualization
  neuralSeries: number[]
  appendNeuralPoint: () => void

  // Activity stream
  activities: Activity[]
  addActivity: (activity: Activity) => void
  clearActivities: () => void

  // Uptime
  uptimeSeconds: number
  incrementUptime: () => void
}

/* ─────────────────────────────────────────
   STORE CREATION
───────────────────────────────────────── */
export const useStore = create<Store>((set, get) => ({
  // Agents initialization
  agents: [
    { id: 'alpha', name: 'Alpha Prime', status: 'active', efficiency: 94, color: '#00c8ff', processCount: 2847 },
    { id: 'beta', name: 'Beta Relay', status: 'idle', efficiency: 87, color: '#00ff8c', processCount: 1923 },
    { id: 'gamma', name: 'Gamma Neural', status: 'active', efficiency: 92, color: '#a855f7', processCount: 3104 },
  ],
  selectedAgentId: 'alpha',

  setSelectedAgent: (id: string) => set({ selectedAgentId: id }),

  updateAgentStatus: (id: string, status: Agent['status']) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, status } : agent
      ),
    }))
  },

  updateAgentMetrics: () => {
    set((state) => ({
      agents: state.agents.map((agent) => ({
        ...agent,
        efficiency: Math.max(60, Math.min(99, agent.efficiency + (Math.random() - 0.5) * 10)),
        processCount: agent.processCount + Math.floor(Math.random() * 50),
      })),
    }))
  },

  // Metrics
  metrics: {
    throughput: 2.4,
    latency: 42,
    cpuUsage: 68,
    memoryUsage: 54,
    activeConnections: 127,
  },

  updateMetrics: () => {
    set((state) => ({
      metrics: {
        throughput: Math.max(0.5, Math.min(4.8, state.metrics.throughput + (Math.random() - 0.5) * 0.3)),
        latency: Math.max(10, Math.min(150, state.metrics.latency + (Math.random() - 0.5) * 20)),
        cpuUsage: Math.max(20, Math.min(95, state.metrics.cpuUsage + (Math.random() - 0.5) * 15)),
        memoryUsage: Math.max(30, Math.min(90, state.metrics.memoryUsage + (Math.random() - 0.5) * 10)),
        activeConnections: Math.max(50, Math.min(500, state.metrics.activeConnections + Math.floor((Math.random() - 0.5) * 50))),
      },
    }))
  },

  // Neural series
  neuralSeries: Array(60).fill(0).map(() => Math.random() * 100),

  appendNeuralPoint: () => {
    set((state) => ({
      neuralSeries: [...state.neuralSeries.slice(1), Math.random() * 100],
    }))
  },

  // Activity stream
  activities: [],

  addActivity: (activity: Activity) => {
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 50),
    }))
  },

  clearActivities: () => set({ activities: [] }),

  // Uptime
  uptimeSeconds: 0,

  incrementUptime: () => {
    set((state) => ({
      uptimeSeconds: state.uptimeSeconds + 1,
    }))
  },
}))

/* ─────────────────────────────────────────
   UTILITY FUNCTIONS
───────────────────────────────────────── */
const activityTypes = ['process', 'alert', 'metric', 'event'] as const
const severities = ['info', 'warning', 'critical'] as const
const agentNames = ['Alpha Prime', 'Beta Relay', 'Gamma Neural', 'Delta Core', 'Epsilon Net']

export function generateActivity(): Activity {
  const types = ['Synchronized cross-domain inference engine', 'Neural network calibration complete', 'Quantum state vector aligned', 'Distributed consensus reached', 'Pattern recognition cycle initiated', 'Memory allocation optimized', 'Cache coherency verified', 'Thermal management nominal', 'Bandwidth saturation: 82%', 'Latency spike detected', 'Authorization timeout', 'Circuit breaker activated', 'Anomaly detected in stream 7', 'Failover initiated', 'Data integrity check passed']

  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
    agent: agentNames[Math.floor(Math.random() * agentNames.length)],
    message: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
  }
}