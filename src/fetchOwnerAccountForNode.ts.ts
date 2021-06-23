import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'

export async function fetchOwnerAccountForNode(
  nodeId: number
): Promise<I_v_UserAccount | undefined> {
  const result = await sendHubRequest(`/api/hubServices/node/${nodeId}/ownerAccount`, 'GET')
  if (result.success) {
    return result.data
  } else {
    return undefined
  }
}
