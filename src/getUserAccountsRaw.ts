import { sendHubRequest } from "./request"


export type UserFilterOptions = {
  firstName?: string
  lastName?: string
  email?: string
  includeDeleted?: boolean
  includeTerminated?: boolean
}

export async function getUserAccountsRaw (
  filter: UserFilterOptions
){

  const endpoint = `/api/hubServices/getUserAccountsRaw`

  const result = await sendHubRequest(endpoint, 'POST', filter)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}