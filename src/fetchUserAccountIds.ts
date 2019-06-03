import { getCacheInstance } from './hubCache'
import { ensureNumericNodeIds } from './ensureNumericNodeIds'

export async function fetchUserAccountIds(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = []
): Promise<{ [key: number]: number[] }> {
  const cacheService = getCacheInstance()
  const finalIncludeNodes = ensureNumericNodeIds(includeNodes, 1, true)
  const finalExcludeNodes = ensureNumericNodeIds(excludeNodes, 1)
  const result: { [key: number]: number[] } = {}
  finalIncludeNodes.forEach(
    (nodeId) =>
      (result[nodeId] = cacheService.getDescendantUserAccountIds([nodeId], finalExcludeNodes))
  )

  return result
}
