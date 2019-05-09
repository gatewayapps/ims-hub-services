import { sendHubRequest } from './request'
import { I_v_UserAccount } from './types/I_v_UserAccount'

export async function fetchCachedUsers(userAccountIds: number[]): Promise<I_v_UserAccount[]> {
  const body = {
    userAccountIds
  }

  const endpoint = `/api/hubServices/fetchCachedUsers`

  const result = await sendHubRequest(endpoint, 'POST', body)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
