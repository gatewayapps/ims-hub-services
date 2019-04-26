import wait from 'waait'
import { sendHubRequest } from './request'
import { IPackageMetadata } from './types/IPackageMetadata'
import { IPackageMetadataRequestBody } from './types/IPackageMetadataRequestBody'
import { signDataWithSecret } from './signDataWithSecret'

const DELAY_FACTOR = 2
const DELAY_MULTIPLIER = 1000

export async function updatePackageMetadata(
  metadata: IPackageMetadata,
  secret: string,
  maxAttempts: number = 5
): Promise<boolean> {
  const body: IPackageMetadataRequestBody = {
    data: metadata,
    signature: signDataWithSecret(metadata, secret)
  }
  return await attemptUpdatePackageMetadata(body, maxAttempts)
}

async function attemptUpdatePackageMetadata(
  body: IPackageMetadataRequestBody,
  maxAttempts: number,
  attempt: number = 1
): Promise<boolean> {
  let result: any
  try {
    const endpoint = '/api/package/metadata'
    result = await sendHubRequest(endpoint, undefined, body)
  } catch (err) {
    result = {
      success: false,
      message: err.message
    }
  }

  if (result && result.success) {
    return true
  }

  if (attempt < maxAttempts) {
    const delay = Math.pow(DELAY_FACTOR, attempt) * DELAY_MULTIPLIER
    await wait(delay)
    return attemptUpdatePackageMetadata(body, maxAttempts, attempt + 1)
  }
  throw new Error(result.message || 'Unexpected response sending package metadata to hub')
}
