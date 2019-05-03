import { sendHubRequest, getConfiguration } from './request'

export async function fetchOrderedNodeIdsForPermission(
  role: string = 'user',
  permission: string = '*',
  treeId: number = 1,
  userAccessToken: string
): Promise<number[]> {
  const { PACKAGE_ID } = getConfiguration()
  const queryParts = [
    `role=${encodeURIComponent(role)}`,
    `permission=${encodeURIComponent(permission)}`,
    `treeId=${treeId}`,
    `packageId=${encodeURIComponent(PACKAGE_ID!)}`
  ]
  const endpoint = `/api/hubServices/fetchOrderedNodeIdsForPermission?${queryParts.join('&')}`

  const result = await sendHubRequest(endpoint, 'GET', userAccessToken, undefined)
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
