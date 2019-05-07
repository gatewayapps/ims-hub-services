import { getGrantDenyNodesForPermission } from './getGrantDenyNodesFromPermissions'

export function getNodesFromPermissions(
  packageId: string,
  role: string,
  treeId: number,
  action: string,
  permissions: any
) {
  const permissionNodes: {
    grantNodes: Array<string | number>
    denyNodes: Array<string | number>
  } = getGrantDenyNodesForPermission(permissions, `${role}:${action}`)

  return permissionNodes
}
