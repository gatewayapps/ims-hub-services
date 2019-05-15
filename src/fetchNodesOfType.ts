import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'
import { I_v_NodeCache } from './types/I_v_NodeCache'
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
