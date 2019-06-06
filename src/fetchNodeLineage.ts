import { ICompactNode } from './types/ICompactNode'
import { getCacheInstance } from './hubCache'

export async function fetchNodeLineage(nodeId: number): Promise<{ [key: number]: ICompactNode }> {
  const cacheService = getCacheInstance()
  return cacheService.getLineageForNode(nodeId)
}
