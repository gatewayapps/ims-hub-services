import { sendHubRequest } from './request'
import { ICachedNode } from './types/ICachedNode'
import { IPermissionRequestBody } from './types/IPermissionRequestBody'

export async function fetchNodesForPermission(
  role: string = 'user',
  permission: string = '*',
  treeId: number = 1,
  userAccessToken: string
): Promise<{ [key: number]: ICachedNode }> {
  const endpoint = '/api/hubServices/fetchNodesForPermission'
  const body: IPermissionRequestBody = {
    role,
    permission,
    treeId
  }

  return await sendHubRequest(endpoint, userAccessToken, body, 'POST')
}
