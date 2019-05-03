import { sendHubRequest, getConfiguration } from './request'
import { ICachedNode } from './types/ICachedNode'

export async function fetchNodesForPermission(
  role: string = 'user',
  permission: string = '*',
  treeId: number = 1,
  userAccessToken: string
): Promise<{ [key: number]: ICachedNode }> {
  const { PACKAGE_ID } = getConfiguration()
  const queryParts = [
    `role=${encodeURIComponent(role)}`,
    `permission=${encodeURIComponent(permission)}`,
    `treeId=${treeId}`,
    `packageId=${encodeURIComponent(PACKAGE_ID!)}`
  ]
  const endpoint = `/api/hubServices/fetchNodesForPermission?${queryParts.join('&')}`

  const result = await sendHubRequest(endpoint, 'GET', userAccessToken)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
