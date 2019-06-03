import { I_v_UserAccount } from './types/I_v_UserAccount'
import { getCacheInstance } from './hubCache'
import { ensureNumericNodeIds } from './ensureNumericNodeIds'

export async function fetchUsers(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = []
): Promise<I_v_UserAccount[]> {
  const cacheService = getCacheInstance()
  const finalIncludeNodes = ensureNumericNodeIds(includeNodes, 1, true)
  const finalExcludeNodes = ensureNumericNodeIds(excludeNodes, 1)

  return cacheService.getDescendantUsers(finalIncludeNodes, finalExcludeNodes)
}
