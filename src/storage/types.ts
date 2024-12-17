import type { HabitLog } from '../types'

export interface LogsIndex {
  totalLogs: number
  chunks: {
    [chunkId: string]: {
      startDate: string
      endDate: string
      habitIds: string[]
      size: number
    }
  }
}

export interface ChunkCache {
  [chunkId: string]: {
    data: HabitLog[]
    lastAccessed: number
  }
}