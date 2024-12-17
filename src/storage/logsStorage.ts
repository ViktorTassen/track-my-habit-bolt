import type { HabitLog } from '../types'
import type { LogsIndex } from './types'
import { STORAGE_KEYS, CHUNK_SIZE } from './constants'
import { logsCache } from './cache'

// Initialize or get logs index
const getLogsIndex = (): LogsIndex => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS_INDEX)
  if (stored) {
    return JSON.parse(stored)
  }
  return { totalLogs: 0, chunks: {} }
}

// Save logs index
const saveLogsIndex = (index: LogsIndex): void => {
  localStorage.setItem(STORAGE_KEYS.LOGS_INDEX, JSON.stringify(index))
}

// Get chunk ID for a specific date
const getChunkId = (date: string): string => {
  const timestamp = new Date(date).getTime()
  return Math.floor(timestamp / (CHUNK_SIZE * 24 * 60 * 60 * 1000)).toString()
}

// Save logs chunk
const saveLogsChunk = (chunkId: string, logs: HabitLog[]): void => {
  const key = `${STORAGE_KEYS.LOGS_CHUNK_PREFIX}-${chunkId}`
  localStorage.setItem(key, JSON.stringify(logs))
  logsCache.set(chunkId, logs)
}

// Load logs chunk
const loadLogsChunk = async (chunkId: string): Promise<HabitLog[]> => {
  // Check cache first
  const cached = logsCache.get(chunkId)
  if (cached) {
    return cached
  }

  // Load from localStorage
  const key = `${STORAGE_KEYS.LOGS_CHUNK_PREFIX}-${chunkId}`
  const stored = localStorage.getItem(key)
  const logs = stored ? JSON.parse(stored) : []
  
  // Update cache
  logsCache.set(chunkId, logs)
  
  return logs
}

export const saveLogs = async (logs: HabitLog[]): Promise<void> => {
  const index = getLogsIndex()
  const chunks: { [key: string]: HabitLog[] } = {}

  // Group logs by chunk
  logs.forEach(log => {
    const chunkId = getChunkId(log.date)
    if (!chunks[chunkId]) {
      chunks[chunkId] = []
    }
    chunks[chunkId].push(log)
  })

  // Update chunks and index
  for (const [chunkId, chunkLogs] of Object.entries(chunks)) {
    const sortedLogs = chunkLogs.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    index.chunks[chunkId] = {
      startDate: sortedLogs[0].date,
      endDate: sortedLogs[sortedLogs.length - 1].date,
      habitIds: [...new Set(sortedLogs.map(log => log.habitId))],
      size: sortedLogs.length
    }

    await saveLogsChunk(chunkId, sortedLogs)
  }

  index.totalLogs = logs.length
  saveLogsIndex(index)
}

export const getLogs = async (): Promise<HabitLog[]> => {
  const index = getLogsIndex()
  const allLogs: HabitLog[] = []

  // Load all chunks
  for (const chunkId of Object.keys(index.chunks)) {
    const chunkLogs = await loadLogsChunk(chunkId)
    allLogs.push(...chunkLogs)
  }

  return allLogs.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export const getLogsForDateRange = async (
  startDate: string,
  endDate: string
): Promise<HabitLog[]> => {
  const index = getLogsIndex()
  const relevantLogs: HabitLog[] = []
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  // Find relevant chunks
  for (const [chunkId, chunk] of Object.entries(index.chunks)) {
    const chunkStart = new Date(chunk.startDate).getTime()
    const chunkEnd = new Date(chunk.endDate).getTime()

    if (chunkEnd >= start && chunkStart <= end) {
      const chunkLogs = await loadLogsChunk(chunkId)
      relevantLogs.push(
        ...chunkLogs.filter(log => {
          const logTime = new Date(log.date).getTime()
          return logTime >= start && logTime <= end
        })
      )
    }
  }

  return relevantLogs.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}