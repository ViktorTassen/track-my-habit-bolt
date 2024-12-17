// Storage keys and configuration
export const STORAGE_KEYS = {
  HABITS: 'habits',
  LOGS_INDEX: 'habit-logs-index',
  LOGS_CHUNK_PREFIX: 'habit-logs-chunk',
  PROGRESS: 'user-progress'
} as const

export const CHUNK_SIZE = 100 // Number of logs per chunk
export const MAX_CHUNKS_IN_MEMORY = 10 // Maximum number of chunks to keep in memory