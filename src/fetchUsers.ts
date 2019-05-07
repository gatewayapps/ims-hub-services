import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'

export async function fetchUsers(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = []
): Promise<I_v_UserAccount[]> {
  const body = {
    include: includeNodes,
    exclude: excludeNodes,
    treeId: 1
  }

  const endpoint = `/api/hubServices/fetchUsers`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
