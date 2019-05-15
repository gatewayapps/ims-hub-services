import { sendHubRequest } from './request'

import { ICachedNode } from './types/ICachedNode'

export async function fetchCachedNodes(nodeIds: number[]): Promise<ICachedNode[]> {
  const body = {
    nodeIds
  }

  const endpoint = `/api/hubServices/fetchCachedNodes`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
