import { sendHubRequest } from './request'
import { INodeWithChildren } from './types/INodeWithChildren'

export async function fetchTree(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = [],
  treeId: number = 1
): Promise<INodeWithChildren[]> {
  const body = {
    include: includeNodes,
    exclude: excludeNodes,
    treeId
  }

  const endpoint = `/api/hubServices/fetchTree`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
