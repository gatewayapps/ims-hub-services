import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'

export async function fetchNodeLineage(nodeId: number): Promise<number[]> {
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
