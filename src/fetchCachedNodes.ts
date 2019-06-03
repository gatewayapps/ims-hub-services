import { ICachedNode } from './types/ICachedNode'
import { getCacheInstance } from './hubCache'

export async function fetchCachedNodes(nodeIds: number[]): Promise<ICachedNode[]> {
  const cacheService = getCacheInstance()
  return cacheService.getCachedNodes(nodeIds)
}
