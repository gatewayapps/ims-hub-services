import { ICachedNode } from './types/ICachedNode'
import { getCacheInstance } from './hubCache'

export async function fetchUserAncestorOfType(
  userAccountIds: (number)[] = [],
  ancestorNodeTypeId: number
): Promise<{ [key: number]: ICachedNode }> {
  const cacheService = getCacheInstance()
  const users = cacheService.getCachedUsers(userAccountIds)
  const nodes = cacheService.getCachedNodes(users.map((u) => u.nodeId!))

  const result: any = {}

  nodes.forEach((n) => {
    const ancestors = n.ancestorIds || []
    ancestors.forEach((anc) => {
      const ancestorNode = cacheService.getCachedNodes([anc])[0]
      if (ancestorNode.nodeTypeId === ancestorNodeTypeId) {
        const user = users.find((u) => u.nodeId === n.nodeId)
        if (user) {
          result[user.userAccountId] = ancestorNode
        }
      }
    })
  })
  return result
}
