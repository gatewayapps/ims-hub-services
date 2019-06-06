import { ICachedNode } from './types/ICachedNode'
import { ensureNumericNodeIds } from './ensureNumericNodeIds'
import { getCacheInstance } from './hubCache'

export async function fetchTreeData(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = [],
  treeId: number = 1
): Promise<{ nodeHashMap: { [key: number]: ICachedNode }; orderedNodeIds: number[] }> {
  const cacheService = getCacheInstance()
  const finalIncludeNodes = ensureNumericNodeIds(includeNodes, treeId, true)
  const finalExcludeNodes = ensureNumericNodeIds(excludeNodes, treeId)

  const nodeHashMap = cacheService.getNodes(finalIncludeNodes, finalExcludeNodes, treeId)
  const orderedNodeIds = cacheService.getOrderedNodeIds(
    finalIncludeNodes,
    finalExcludeNodes,
    treeId
  )

  return { nodeHashMap, orderedNodeIds }
}
