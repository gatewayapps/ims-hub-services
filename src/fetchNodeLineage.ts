import { sendHubRequest } from './request'

import { ICompactNode } from './types/ICompactNode'

export async function fetchNodeLineage(nodeId: number): Promise<{ [key: number]: ICompactNode }> {
  const body = {
    nodeId
  }

  const endpoint = `/api/hubServices/fetchNodeLineage`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
