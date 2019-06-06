import { uniq } from 'lodash'
import { getCacheInstance } from './hubCache'

export function ensureNumericNodeIds(
  nodeIds: Array<string | number>,
  treeId: number,
  defaultAll: boolean = false
) {
  const cacheService = getCacheInstance()
  if (!nodeIds) {
    return []
  }
  const result = nodeIds.reduce<number[]>((result, node) => {
    if (typeof node === 'number' && node > 0) {
      result.push(node)
    } else {
      const rootNodeIds = cacheService.getRootNodeIdsForTree(treeId)
      result.push(...rootNodeIds)
    }
    return result
  }, [])

  if (defaultAll && result.length === 0) {
    const rootNodeIds = cacheService.getRootNodeIdsForTree(treeId)
    result.push(...rootNodeIds)
  }

  return uniq(result)
}
