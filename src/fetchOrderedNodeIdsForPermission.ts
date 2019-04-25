import { sendHubRequest } from './request'
import { IPermissionRequestBody } from './types/IPermissionRequestBody'

export async function fetchOrderedNodeIdsForPermission(
  role: string = 'user',
  permission: string = '*',
  treeId: number = 1,
  userAccessToken: string
): Promise<number[]> {
  const endpoint = '/api/hubServices/fetchOrderedNodeIdsForPermission'
  const body: IPermissionRequestBody = {
    role,
    permission,
    treeId
  }

  return await sendHubRequest(endpoint, userAccessToken, body, 'POST')
}
