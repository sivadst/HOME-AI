import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type AgentStatus = 'IDLE' | 'REASONING' | 'ANALYZING' | 'SIMULATING' | 'MONITORING' | 'SCANNING' | 'PROCESSING' | 'INDEXING' | 'RUNNING' | 'DECIDING' | 'TRACKING'

export interface AIAgent {
  id: string
  name: string
  role: string
  icon: string
  color: string
  colorDim: string
  status: AgentStatus
  cpu: number
  memory: number
  tasks: number
  accuracy: number
  uptime: string
  lastAction: string
}

export interface MetricPoint {
  timestamp: number
  value: number
}

export interface GlobalMetrics {
  opsPerSec: number
  activeNodes: number
  predictionAccuracy: number
  intelligenceQuotient: number
  marketCap: string
  latency: number
  confidence: number
  predictions: string
  networkHealth: number
  threatLevel: number
}

export interface ActivityEvent {
  id: string
  timestamp: Date
  type: 'INTEL' | 'PRED' | 'SYS' | 'WARN' | 'CRIT' | 'EXEC' | 'NET'
  agent: string
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agentId?: string
  isStreaming?: boolean
}

export type ActiveView = 'command' | 'network' | 'analytics' | 'forecast' | 'warroom'

export interface NeuralSeries {
  label: string
  color: string
  data: MetricPoint[]
}

// ─── STORE ───────────────────────────────────────────────────────────────────

interface HomeAIStore {
  // View
  activeView: ActiveView
  setActiveView: (v: ActiveView) => void

  // Agents
  agents: AIAgent[]
  selectedAgentId: string | null
  setSelectedAgent: (id: string) => void
  updateAgentMetrics: () => void

  // Metrics
  metrics: GlobalMetrics
  updateMetrics: () => void

  // Neural series history
  neuralSeries: NeuralSeries[]
  appendNeuralPoint: () => void

  // Activity
  activities: ActivityEvent[]
  addActivity: (event: ActivityEvent) => void

  // Chat
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  updateStreamingMessage: (id: string, content: string) => void
  finalizeMessage: (id: string) => void

  // System
  uptime: number
  incrementUptime: () => void
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  setConnectionStatus: (s: 'connected' | 'connecting' | 'disconnected') => void
}

// ─── INITIAL AGENTS ──────────────────────────────────────────────────────────

const INITIAL_AGENTS: AIAgent[] = [
  { id: 'strategy', name: 'Strategy AI', role: 'Executive Intelligence', icon: '🧠', color: '#00c8ff', colorDim: 'rgba(0,200,255,0.12)', status: 'REASONING', cpu: 87, memory: 72, tasks: 14, accuracy: 94.2, uptime: '847h', lastAction: 'Generated Q3 strategic brief' },
  { id: 'finance', name: 'Finance AI', role: 'Market Orchestration', icon: '📊', color: '#f0b429', colorDim: 'rgba(240,180,41,0.12)', status: 'ANALYZING', cpu: 72, memory: 58, tasks: 31, accuracy: 91.7, uptime: '823h', lastAction: 'Processed 2.4B data points' },
  { id: 'risk', name: 'Risk AI', role: 'Threat Assessment', icon: '⚠️', color: '#ff3c5f', colorDim: 'rgba(255,60,95,0.12)', status: 'SCANNING', cpu: 44, memory: 39, tasks: 8, accuracy: 97.1, uptime: '847h', lastAction: 'Flagged 2 anomaly signatures' },
  { id: 'prediction', name: 'Prediction AI', role: 'Future Modeling', icon: '🔮', color: '#a855f7', colorDim: 'rgba(168,85,247,0.12)', status: 'SIMULATING', cpu: 93, memory: 88, tasks: 7, accuracy: 98.7, uptime: '834h', lastAction: 'Ran 10K Monte Carlo iterations' },
  { id: 'research', name: 'Research AI', role: 'Deep Synthesis', icon: '🔬', color: '#00ff8c', colorDim: 'rgba(0,255,140,0.12)', status: 'INDEXING', cpu: 61, memory: 54, tasks: 22, accuracy: 89.4, uptime: '847h', lastAction: 'Indexed 847M documents' },
  { id: 'market', name: 'Market AI', role: 'Opportunity Seeker', icon: '📈', color: '#f0b429', colorDim: 'rgba(240,180,41,0.12)', status: 'TRACKING', cpu: 78, memory: 65, tasks: 19, accuracy: 93.1, uptime: '801h', lastAction: 'Detected 7 sector signals' },
  { id: 'defense', name: 'Defense AI', role: 'Threat Containment', icon: '🛡️', color: '#ff3c5f', colorDim: 'rgba(255,60,95,0.12)', status: 'MONITORING', cpu: 33, memory: 28, tasks: 5, accuracy: 99.2, uptime: '847h', lastAction: 'Neutralized 3 threat vectors' },
  { id: 'analytics', name: 'Analytics AI', role: 'Data Synthesis', icon: '🎯', color: '#00c8ff', colorDim: 'rgba(0,200,255,0.12)', status: 'PROCESSING', cpu: 56, memory: 48, tasks: 27, accuracy: 92.8, uptime: '847h', lastAction: 'Synthesized 12 data streams' },
  { id: 'executive', name: 'Executive AI', role: 'Decision Authority', icon: '👁️', color: '#a855f7', colorDim: 'rgba(168,85,247,0.12)', status: 'DECIDING', cpu: 68, memory: 61, tasks: 3, accuracy: 96.5, uptime: '847h', lastAction: 'Approved 2 strategic initiatives' },
  { id: 'simulation', name: 'Simulation AI', role: 'Scenario Engine', icon: '⚡', color: '#00ff8c', colorDim: 'rgba(0,255,140,0.12)', status: 'RUNNING', cpu: 81, memory: 76, tasks: 11, accuracy: 95.3, uptime: '839h', lastAction: 'Completed 500 scenario runs' },
]

const INITIAL_NEURAL_SERIES: NeuralSeries[] = [
  { label: 'STRATEGY', color: '#00c8ff', data: Array.from({ length: 20 }, (_, i) => ({ timestamp: Date.now() - (20 - i) * 3000, value: 70 + Math.random() * 25 })) },
  { label: 'PREDICT', color: '#a855f7', data: Array.from({ length: 20 }, (_, i) => ({ timestamp: Date.now() - (20 - i) * 3000, value: 80 + Math.random() * 18 })) },
  { label: 'RISK', color: '#ff3c5f', data: Array.from({ length: 20 }, (_, i) => ({ timestamp: Date.now() - (20 - i) * 3000, value: 30 + Math.random() * 40 })) },
  { label: 'MARKET', color: '#f0b429', data: Array.from({ length: 20 }, (_, i) => ({ timestamp: Date.now() - (20 - i) * 3000, value: 60 + Math.random() * 30 })) },
]

const ACTIVITY_TEMPLATES: Array<Omit<ActivityEvent, 'id' | 'timestamp'>> = [
  { type: 'INTEL', agent: 'Strategy AI', message: 'Market pattern recognized: emerging tech breakout in 7 sectors', severity: 'MEDIUM' },
  { type: 'PRED', agent: 'Prediction AI', message: 'Updated 2,847 models with latest training batch. Accuracy: 98.7%', severity: 'LOW' },
  { type: 'SYS', agent: 'System', message: 'Neural network sync complete across 1,204 nodes. Latency: 847ms', severity: 'LOW' },
  { type: 'WARN', agent: 'Risk AI', message: 'Elevated volatility detected in commodities cluster. Risk Index: 6.7', severity: 'MEDIUM' },
  { type: 'CRIT', agent: 'Defense AI', message: 'Neutralized 3 anomaly signatures. Threat level returned to NOMINAL', severity: 'HIGH' },
  { type: 'EXEC', agent: 'Executive AI', message: 'Strategic briefing generated for Q3. 5 action items identified', severity: 'LOW' },
  { type: 'NET', agent: 'Network', message: 'Intelligence route established: APAC ↔ EMEA. Bandwidth: 847 Gbps', severity: 'LOW' },
  { type: 'INTEL', agent: 'Market AI', message: 'High-confidence signal: quantum computing sector +23% in 14 days', severity: 'HIGH' },
  { type: 'PRED', agent: 'Simulation AI', message: 'Scenario cluster completed: 10K Monte Carlo iterations. Confidence: 94.2%', severity: 'MEDIUM' },
  { type: 'SYS', agent: 'Analytics AI', message: 'Data pipeline optimized. Processing throughput increased by 31%', severity: 'LOW' },
]

// ─── CREATE STORE ─────────────────────────────────────────────────────────────

export const useStore = create<HomeAIStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // View
      activeView: 'command',
      setActiveView: (v) => set({ activeView: v }),

      // Agents
      agents: INITIAL_AGENTS,
      selectedAgentId: 'strategy',
      setSelectedAgent: (id) => set({ selectedAgentId: id }),
      updateAgentMetrics: () => set((state) => ({
        agents: state.agents.map((a) => ({
          ...a,
          cpu: Math.max(10, Math.min(98, a.cpu + (Math.random() - 0.48) * 6)),
          memory: Math.max(10, Math.min(95, a.memory + (Math.random() - 0.5) * 4)),
          tasks: Math.max(1, a.tasks + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0)),
        })),
      })),

      // Metrics
      metrics: {
        opsPerSec: 247000,
        activeNodes: 1204,
        predictionAccuracy: 98.7,
        intelligenceQuotient: 9.4,
        marketCap: '$2.41T',
        latency: 847,
        confidence: 94.3,
        predictions: '3.7B',
        networkHealth: 99.97,
        threatLevel: 0.3,
      },
      updateMetrics: () => set((state) => ({
        metrics: {
          ...state.metrics,
          opsPerSec: Math.floor(240000 + Math.random() * 20000),
          activeNodes: Math.floor(1190 + Math.random() * 30),
          predictionAccuracy: parseFloat((98 + Math.random() * 1.5).toFixed(1)),
          latency: Math.floor(820 + Math.random() * 60),
          confidence: parseFloat((92 + Math.random() * 4).toFixed(1)),
          networkHealth: parseFloat((99.9 + Math.random() * 0.09).toFixed(2)),
        },
      })),

      // Neural series
      neuralSeries: INITIAL_NEURAL_SERIES,
      appendNeuralPoint: () => set((state) => ({
        neuralSeries: state.neuralSeries.map((s) => ({
          ...s,
          data: [
            ...s.data.slice(-29),
            { timestamp: Date.now(), value: Math.max(5, Math.min(100, s.data[s.data.length - 1].value + (Math.random() - 0.45) * 8)) },
          ],
        })),
      })),

      // Activities
      activities: [],
      addActivity: (event) => set((state) => ({
        activities: [event, ...state.activities].slice(0, 50),
      })),

      // Chat
      messages: [],
      addMessage: (msg) => set((state) => ({
        messages: [...state.messages.slice(-20), msg],
      })),
      updateStreamingMessage: (id, content) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, content, isStreaming: true } : m
        ),
      })),
      finalizeMessage: (id) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, isStreaming: false } : m
        ),
      })),

      // System
      uptime: 847 * 3600 + 23 * 60 + 11,
      incrementUptime: () => set((state) => ({ uptime: state.uptime + 1 })),
      connectionStatus: 'connected',
      setConnectionStatus: (s) => set({ connectionStatus: s }),
    })),
    { name: 'home-ai-store' }
  )
)

// ─── ACTIVITY GENERATOR (called from effects) ────────────────────────────────

let activityIdx = 0
export function generateActivity(): ActivityEvent {
  const template = ACTIVITY_TEMPLATES[activityIdx % ACTIVITY_TEMPLATES.length]
  activityIdx++
  return {
    ...template,
    id: `act-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
  }
}
