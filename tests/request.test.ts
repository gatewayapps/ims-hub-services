import '../src/global'
import 'isomorphic-fetch'

import {
  initializeHubServices,
  buildHeadersForRequest,
  sendHubRequest,
  getConfiguration,
  sendRequestAndHandleResponse
} from '../src/request'

import constants from '../src/constants'

const packageId = 'ims.packages.test'
const acceptHeader = 'application/json'
const contentTypeHeader = 'application/json'
const accessToken = 'abc123'
const signature = '12345abcdef'

describe('getConfiguration', () => {
  beforeEach(() => {
    initializeHubServices('', '', '')
  })
  it('should return empty strings when called without initializeHubServices', () => {
    expect(getConfiguration()).toEqual({ HUB_URL: '', PACKAGE_ID: '', PACKAGE_SECRET: '' })
  })
  it('should return correct values when called after initializeHubServices', () => {
    initializeHubServices('http://www.google.com', 'test_package', 'abc123')
    expect(getConfiguration()).toEqual({
      HUB_URL: 'http://www.google.com',
      PACKAGE_ID: 'test_package',
      PACKAGE_SECRET: 'abc123'
    })
  })
})

describe('sendHubRequest', () => {
  beforeEach(() => {
    initializeHubServices('', '', '')
    jest.spyOn(global, 'fetch').mockReset()
  })

  it('should throw an error if initializeHubServices has not been called', () => {
    expect(sendHubRequest('/', 'GET')).rejects.toEqual(
      Error('You must call initializeHubServices before consuming any hub services')
    )
  })
  it('should throw an error if called with GET and a body', () => {
    expect(sendHubRequest('/', 'GET', {})).rejects.toEqual(
      Error('You cannot have a body in a GET request')
    )
  })

  it('should call sendRequestAndHandleResponse', async () => {
    initializeHubServices('http://www.google.com', 'test', 'abc123')
    const mockSuccessResponse = {
      success: true
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
    const mockFetchPromise: any = Promise.resolve({
      json: () => mockJsonPromise
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)
    expect(await sendHubRequest('/', 'GET')).toMatchObject({ success: true })
    expect(global.fetch).toHaveBeenCalled()
  })
})

describe('sendRequestAndHandleResponse', () => {
  beforeEach(() => {
    initializeHubServices('', '', '')
    jest.spyOn(global, 'fetch').mockReset()
  })

  it('should return success: false and an error if given an invalid url', async () => {
    expect(await sendRequestAndHandleResponse('###', {})).toMatchObject({
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
    expect(global.fetch).toHaveBeenCalled()
  })
})

describe('buildHeadersForRequest', () => {
  it('should add an accept, content-type, and package-id header', () => {
    expect(buildHeadersForRequest(packageId)).toMatchObject({
      [constants.PackageIdHeader]: packageId,
      Accept: acceptHeader,
      ['Content-Type']: contentTypeHeader
    })
  })

  it('should add a signature if provided', () => {
    expect(buildHeadersForRequest(packageId, signature)).toMatchObject({
      [constants.SignatureHeader]: signature
    })
  })
})
