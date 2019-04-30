import { IPackageDependencies } from './types/IPackageMetadata'
import { IRefreshUserAccessTokenRequestBody } from './types/IRefreshUserAccessTokenRequestBody'
import { getPackageId, sendHubRequest } from './request'
import { IRefreshUserAccessTokenResult } from './types/IRefreshUserAccessTokenResult'

export async function refreshUserAccessToken(
  refreshToken: string,
  packageDependencies?: IPackageDependencies
): Promise<IRefreshUserAccessTokenResult> {
  const packageId = getPackageId()
  if (!packageId) {
    throw new Error('You must call initializeHubServices before consuming any hub services')
  }

  if (packageDependencies) {
    return requestMultipleAccessTokens(refreshToken, packageId, packageDependencies)
  } else {
    return requestSingleAccessToken(refreshToken, packageId)
  }
}

async function requestSingleAccessToken(
  refreshToken: string,
  packageId: string
): Promise<IRefreshUserAccessTokenResult> {
  const endpoint = '/users/accessToken'
  const body: IRefreshUserAccessTokenRequestBody = {
    refreshToken
  }
  const response = await sendHubRequest(endpoint, undefined, body, 'POST')
  if (response.success) {
    return {
      [packageId]: {
        expires: response.expires,
        token: response.accessToken
      }
    }
  } else {
    throw new Error(`Failed to refresh access token: ${response.message}`)
  }
}

async function requestMultipleAccessTokens(
  refreshToken: string,
  packageId: string,
  packageDependencies?: IPackageDependencies
): Promise<IRefreshUserAccessTokenResult> {
  const packages: string[] = packageDependencies ? Object.keys(packageDependencies) : []
  if (!packages.includes(packageId)) {
    packages.push(packageId)
  }

  const endpoint = '/users/accessTokens'
  const body: IRefreshUserAccessTokenRequestBody = {
    packages,
    refreshToken
  }

  const response = await sendHubRequest(endpoint, undefined, body, 'POST')

  if (response.success === true) {
    if (Array.isArray(response.results)) {
      const result: IRefreshUserAccessTokenResult = response.results.reduce(
        (res: any, obj: any) => {
          res[obj.packageId] = obj.accessToken
          return res
        },
        {}
      )
      return result
    } else {
      throw new Error(`Unexpected response from refresh access token. Results is not an array.`)
    }
  } else {
    throw new Error(`Failed to refresh access token: ${response.message}`)
  }
}
