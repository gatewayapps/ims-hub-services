import { I_v_UserAccount } from './types/I_v_UserAccount'
import { fetchCachedUsers } from './fetchCachedUsers'

export interface IUserCacheRecord {
  cachedAt: number
  record?: I_v_UserAccount
}

const LocalCache: { [key: number]: IUserCacheRecord } = {}

const ONE_MINUTE_MILLIS = 60000
const FIVE_MINUTE_MILLIS = 300000

export async function getUserFromCache(
  userAccountId: number
): Promise<I_v_UserAccount | undefined> {
  const localCopy = LocalCache[userAccountId]
  const currentMillis = new Date().getTime()
  if (localCopy && currentMillis - localCopy.cachedAt < ONE_MINUTE_MILLIS) {
    return localCopy.record
  }

  const remoteUsers = await fetchCachedUsers([userAccountId])

  LocalCache[userAccountId] = {
    cachedAt: currentMillis,
    record: remoteUsers.length > 0 ? remoteUsers[0] : undefined
  }

  return LocalCache[userAccountId].record
}

export async function getUsersFromCache(
  userAccountIds: number[]
): Promise<{ [key: number]: I_v_UserAccount | undefined }> {
  const currentMillis = new Date().getTime()

  const usersToFetch: number[] = []
  const result: { [key: number]: I_v_UserAccount | undefined } = {}

  userAccountIds.forEach((userAccountId) => {
    const localCopy = LocalCache[userAccountId]
    if (localCopy && currentMillis - localCopy.cachedAt < ONE_MINUTE_MILLIS) {
      result[userAccountId] = localCopy.record
    } else {
      usersToFetch.push(userAccountId)
    }
  })

  if (usersToFetch.length > 0) {
    const remoteUsers = await fetchCachedUsers(usersToFetch)
    remoteUsers
      .filter((user) => !!user)
      .forEach((remoteUser) => {
        LocalCache[remoteUser.userAccountId] = {
          cachedAt: currentMillis,
          record: remoteUser
        }
        result[remoteUser.userAccountId] = remoteUser
      })
  }

  return result
}
