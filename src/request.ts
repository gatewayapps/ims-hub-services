import 'isomorphic-fetch'
import { IHubServiceResponse } from './types/IHubServiceResponse'
import { parse } from 'url'
import { signDataWithSecret } from './signDataWithSecret'
import constants from './constants'

let HUB_URL: string | undefined = ''
let PACKAGE_ID: string | undefined = ''
let PACKAGE_SECRET: string | undefined = ''

/**
 * Prepare hub services variables
 * @param hubUrl The URL where the hub is located
 * @param packageId The package consuming the hub services
 */
export function initializeHubServices(hubUrl: string, packageId: string, packageSecret: string) {
  HUB_URL = hubUrl
  PACKAGE_ID = packageId
  PACKAGE_SECRET = packageSecret
}

/**
 * Returns the current hub services configuration
 */
export function getConfiguration() {
  return {
    HUB_URL,
    PACKAGE_ID,
    PACKAGE_SECRET
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
  body?: Object
): Promise<IHubServiceResponse> {
  if (!HUB_URL || !PACKAGE_ID || !PACKAGE_SECRET) {
    throw new Error('You must call initializeHubServices before consuming any hub services')
  }

  if (body && /GET/i.test(method)) {
    throw new Error('You cannot have a body in a GET request')
  }

  const href = new URL(endpoint, HUB_URL)
  const signature = getSignatureForRequest(PACKAGE_SECRET, method, href.href, body)

  const headers = buildHeadersForRequest(PACKAGE_ID, signature)

  return sendRequestAndHandleResponse(href.href, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
}

export function getSignatureForRequest(secret: string, method: string, url: string, body?: Object) {
  const parsedUrl = parse(url)
  return /GET/i.test(method)
    ? signDataWithSecret(parsedUrl.query || '', secret)
    : signDataWithSecret(body || {}, secret)
}

export async function sendRequestAndHandleResponse(url: string, options: RequestInit) {
  try {
    console.log('URL IS', url)
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

  signature?: string
) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    [constants.PackageIdHeader]: packageId
  }

  if (signature) {
    headers[constants.SignatureHeader] = signature
  }

  return headers
}
