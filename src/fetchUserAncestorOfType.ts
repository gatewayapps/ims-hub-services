import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'
import { I_v_NodeCache } from './types/I_v_NodeCache'
import { ICachedNode } from './types/ICachedNode'

export async function fetchUserAncestorOfType(
  userAccountIds: (string | number)[] = [],
  ancestorNodeTypeId: number
): Promise<{ [key: number]: ICachedNode }> {
  const body = {
    userAccountIds,
    ancestorNodeTypeId
  }

  const endpoint = `/api/hubServices/fetchUserAncestorOfType`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
