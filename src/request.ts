import fetch from 'isomorphic-fetch'

const AUTHORIZATION_HEADER = 'x-ims-authorization'
const PACKAGE_ID_HEADER = 'x-ims-package-id'
const AUTHORIZATION_TYPE = 'JWT'
let HUB_URL: string | undefined = undefined
let PACKAGE_ID: string | undefined = undefined

export function initializeHubServices(hubUrl: string, packageId: string) {
  HUB_URL = hubUrl
  PACKAGE_ID = packageId
}

export function getPackageId(): string | undefined {
  return PACKAGE_ID
}

export async function sendHubRequest(
  endpoint: string,
  accessToken: string | undefined,
  body: Object | undefined,
  method: string = 'POST'
) {
  if (!HUB_URL) {
    throw new Error('You must call initializeHubServices before consuming any hub services')
  }

  const href = new URL(endpoint, HUB_URL)
  const headers = buildHeadersForRequest(accessToken)

  const response = await fetch(href.href, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  return response.json()
}

export function buildHeadersForRequest(accessToken: string | undefined) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    [PACKAGE_ID_HEADER]: PACKAGE_ID!
  }

  if (accessToken) {
    headers[AUTHORIZATION_HEADER] = `${AUTHORIZATION_TYPE} ${accessToken}`
  }

  return headers
}
