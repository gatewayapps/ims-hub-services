import '../src/global'
import 'isomorphic-fetch'

import {
  buildHeadersForRequest,
  sendHubRequest,
  sendRequestAndHandleResponse,
  AUTHORIZATION_HEADER,
  PACKAGE_ID_HEADER,
  AUTHORIZATION_TYPE,
  SIGNATURE_HEADER
} from '../src/request'

const packageId = 'ims.packages.test'
const acceptHeader = 'application/json'
const contentTypeHeader = 'application/json'
const accessToken = 'abc123'
const signature = '12345abcdef'

describe('sendREquestAndHandleResponse', () => {
  it('should return success: false and an error if given an invalid url', async () => {
    expect(await sendRequestAndHandleResponse('abc-123###', {})).toMatchObject({
      success: false
    })
  })
  it('should call fetch if given valid arguments', async () => {
    const mockSuccessResponse = {
      success: true
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
    const mockFetchPromise: any = Promise.resolve({
      // 3
      json: () => mockJsonPromise
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

    expect(
      await sendRequestAndHandleResponse('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET'
      })
    ).toMatchObject({
      success: true
    })
    expect(global.fetch).toBeCalledTimes(1)
  })
})

describe('buildHeadersForRequest', () => {
  it('should add an accept, content-type, and package-id header', () => {
    expect(buildHeadersForRequest(packageId)).toMatchObject({
      [PACKAGE_ID_HEADER]: packageId,
      Accept: acceptHeader,
      ['Content-Type']: contentTypeHeader
    })
  })

  it('should add an access token if provided', () => {
    expect(buildHeadersForRequest(packageId, accessToken)).toMatchObject({
      [AUTHORIZATION_HEADER]: `${AUTHORIZATION_TYPE} ${accessToken}`
    })
  })

  it('should add a signature if provided', () => {
    expect(buildHeadersForRequest(packageId, accessToken, signature)).toMatchObject({
      [SIGNATURE_HEADER]: signature
    })
  })
})
