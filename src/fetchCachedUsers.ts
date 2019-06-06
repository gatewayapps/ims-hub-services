import { I_v_UserAccount } from './types/I_v_UserAccount'
import { getCacheInstance } from './hubCache'

export async function fetchCachedUsers(userAccountIds: number[]): Promise<I_v_UserAccount[]> {
  const cacheService = getCacheInstance()
  return cacheService.getCachedUsers(userAccountIds)
}
