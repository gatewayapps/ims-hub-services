import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'

export async function fetchNodeUserAccountIds(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = []
): Promise<{ [key: number]: number }> {
  const body = {
    include: includeNodes,
    exclude: excludeNodes,
    treeId: 1
  }

  const endpoint = `/api/hubServices/fetchNodeUserAccountIds`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
