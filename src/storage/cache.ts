import type { HabitLog } from '../types'
import type { ChunkCache } from './types'
import { MAX_CHUNKS_IN_MEMORY } from './constants'

class LogsCache {
  private cache: ChunkCache = {}
  
  set(chunkId: string, data: HabitLog[]): void {
    // Remove oldest chunks if cache is full
    const chunks = Object.keys(this.cache)
    if (chunks.length >= MAX_CHUNKS_IN_MEMORY) {
      const oldestChunk = chunks.reduce((oldest, current) => {
        return this.cache[current].lastAccessed < this.cache[oldest].lastAccessed
          ? current
          : oldest
      })
      delete this.cache[oldestChunk]
    }

    this.cache[chunkId] = {
      data,
      lastAccessed: Date.now()
    }
  }

  get(chunkId: string): HabitLog[] | null {
    const chunk = this.cache[chunkId]
    if (chunk) {
      chunk.lastAccessed = Date.now()
      return chunk.data
    }
    return null
  }

  clear(): void {
    this.cache = {}
  }
}

export const logsCache = new LogsCache()