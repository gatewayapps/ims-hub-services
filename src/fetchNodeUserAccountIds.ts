import { getCacheInstance } from './hubCache'
import { ensureNumericNodeIds } from './ensureNumericNodeIds'

export async function fetchNodeUserAccountIds(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = []
): Promise<{ [key: number]: number }> {
  const cacheService = getCacheInstance()
  const finalIncludeNodes = ensureNumericNodeIds(includeNodes, 1, true)
  const finalExcludeNodes = ensureNumericNodeIds(excludeNodes, 1)

  const users = cacheService
    .getDescendantUsers(finalIncludeNodes, finalExcludeNodes)
    .reduce<{ [key: number]: number }>((result, userAccount) => {
      result[userAccount.nodeId!] = userAccount.userAccountId
      return result
    }, {})
  return users
}
