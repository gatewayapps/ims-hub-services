import { sendHubRequest } from './request'
import { ICachedNode } from './types/ICachedNode'

export async function fetchNodesOfType(nodeTypeId: number): Promise<ICachedNode[]> {
  const body = {
    nodeTypeId
  }

  const endpoint = `/api/hubServices/fetchNodesOfType`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
