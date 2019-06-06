import { sendHubRequest } from './request'
import { ICachedNode } from './types/ICachedNode'
import { getCacheInstance } from './hubCache'

export async function fetchNodesOfType(nodeTypeId: number): Promise<ICachedNode[]> {
  const cacheService = getCacheInstance()
  return cacheService.getNodesOfType(nodeTypeId)
}
