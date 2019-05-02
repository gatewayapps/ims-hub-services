import { sendHubRequest, getConfiguration } from './request'
import { INodeWithChildren } from './types/INodeWithChildren'

export async function fetchTreeForPermission(
  role: string = 'user',
  permission: string = '*',
  treeId: number = 1,
  userAccessToken: string
): Promise<INodeWithChildren[]> {
  const { PACKAGE_ID } = getConfiguration()
  const queryParts = [
    `role=${encodeURIComponent(role)}`,
    `permission=${encodeURIComponent(permission)}`,
    `treeId=${treeId}`,
    `packageId=${encodeURIComponent(PACKAGE_ID!)}`
  ]
  const endpoint = `/api/hubServices/fetchTreeForPermission?${queryParts.join('&')}`

  return await sendHubRequest(endpoint, userAccessToken, undefined, 'GET')
}
