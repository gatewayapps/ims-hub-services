import { sendHubRequest } from './request'
import { IPackageMetadata } from './types/IPackageMetadata'
import { IPackageMetadataRequestBody } from './types/IPackageMetadataRequestBody'
import { signDataWithSecret } from './signDataWithSecret'

export async function updatePackageMetadata(
  metadata: IPackageMetadata,
  secret: string
): Promise<boolean> {
  const endpoint = '/api/package/metadata'
  const body: IPackageMetadataRequestBody = {
    data: metadata,
    signature: signDataWithSecret(metadata, secret)
  }
  const result = await sendHubRequest(endpoint, undefined, body)
  if (!result.success) {
    throw new Error(result.message || 'Unexpected response sending package metadata to hub')
  }
  return true
}
