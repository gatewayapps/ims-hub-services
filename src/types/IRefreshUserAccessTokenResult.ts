import { IAccessToken } from './IAccessToken'

export interface IRefreshUserAccessTokenResult {
  [packageId: string]: IAccessToken
}
