import 'isomorphic-fetch'
import { IHubServiceResponse } from './types/IHubServiceResponse'

export const SIGNATURE_HEADER = 'x-ims-signature'
export const AUTHORIZATION_HEADER = 'x-ims-authorization'
export const PACKAGE_ID_HEADER = 'x-ims-package-id'
export const AUTHORIZATION_TYPE = 'JWT'
let HUB_URL: string | undefined = undefined
let PACKAGE_ID: string | undefined = undefined

/**
 * Prepare hub services variables
 * @param hubUrl The URL where the hub is located
 * @param packageId The package consuming the hub services
 */
export function initializeHubServices(hubUrl: string, packageId: string) {
  HUB_URL = hubUrl
  PACKAGE_ID = packageId
}

/**
 * Returns the current hub services configuration
 */
export function getConfiguration() {
  return {
    HUB_URL,
    PACKAGE_ID
  }
}

/**
 *
 * @param endpoint The endpoint at the hub to call: ** /api/hubServices/fetchTree ** for example
 * @param method HTTP Method - GET, POST, PUT, etc...
 * @param accessToken - User access token to provide with the request
 * @param body - Payload to be JSON stringify and added to POST request
 * @param signature - Signature of the request
 */
export async function sendHubRequest(
  endpoint: string,
  method: string = 'POST',
  accessToken?: string,
  body?: Object,
  signature?: string
): Promise<IHubServiceResponse> {
  if (!HUB_URL || !PACKAGE_ID) {
    throw new Error('You must call initializeHubServices before consuming any hub services')
  }

  if (body && /GET/i.test(method)) {
    throw new Error('You cannot have a body in a GET request')
  }

  const href = new URL(endpoint, HUB_URL)
  const headers = buildHeadersForRequest(PACKAGE_ID, accessToken, signature)

  return sendRequestAndHandleResponse(href.href, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
}

export async function sendRequestAndHandleResponse(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return {
      success: true,
      data
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}

/**
 * Returns an object with headers for a request
 * @param packageId Package ID for the request
 * @param accessToken User access token
 * @param signature Signaure of the request
 */
export function buildHeadersForRequest(
  packageId: string,
  accessToken?: string,
  signature?: string
) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    [PACKAGE_ID_HEADER]: packageId
  }

  if (accessToken) {
    headers[AUTHORIZATION_HEADER] = `${AUTHORIZATION_TYPE} ${accessToken}`
  }
  if (signature) {
    headers[SIGNATURE_HEADER] = signature
  }

  return headers
}
