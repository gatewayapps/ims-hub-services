import { sendHubRequest } from './request'

import { ICachedNode } from './types/ICachedNode'

export async function fetchTreeData(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = [],
  treeId: number = 1
): Promise<{ nodeHashMap: { [key: number]: ICachedNode }; orderedNodeIds: number[] }> {
  const body = {
    include: includeNodes,
    exclude: excludeNodes,
    treeId
  }

  const endpoint = `/api/hubServices/fetchTreeData`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
