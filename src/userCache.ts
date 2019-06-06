import { I_v_UserAccount } from './types/I_v_UserAccount'
import { fetchCachedUsers } from './fetchCachedUsers'

export async function getUserFromCache(
  userAccountId: number
): Promise<I_v_UserAccount | undefined> {
  const remoteUsers = await fetchCachedUsers([userAccountId])

  if (remoteUsers.length > 0) {
    return remoteUsers[0]
  } else {
    return undefined
  }
}

export async function getUsersFromCache(
  userAccountIds: number[]
): Promise<{ [key: number]: I_v_UserAccount | undefined }> {
  const remoteUsers = await fetchCachedUsers(userAccountIds)
  return remoteUsers.filter((user) => !!user)
}
