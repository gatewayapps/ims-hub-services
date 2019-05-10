import { getConfiguration } from './request'
import constants from './constants'

export function getGrantDenyNodesForPermission(permissions, roleAction) {
  const matchedPermissions = this.findMatchingPermissions(permissions, roleAction)
  const grantPermissions = matchedPermissions.filter((p) => {
    return p.type === constants.RoleTypes.Grant
  })
  const denyPermissions = matchedPermissions.filter((p) => {
    return p.type === constants.RoleTypes.Deny
  })

  const grantNodes = grantPermissions.map((p) => {
    return p.node === '*' ? 0 : parseInt(p.node)
  })
  const denyNodes = denyPermissions.map((p) => {
    return p.node === '*' ? 0 : parseInt(p.node)
  })

  return {
    grantNodes: grantNodes,
    denyNodes: denyNodes
  }
}

export function findMatchingPermissions(permissions, roleAction) {
  const permission = this.createPermissionFromString(roleAction)
  const roleCheckValue = constants.RoleValues[permission.role]
  return permissions.filter((p) => {
    return (
      p.package === getConfiguration().PACKAGE_ID &&
      ((p.role === permission.role && (p.action === permission.action || p.action === '*')) ||
        (constants.RoleValues[p.role] > roleCheckValue && p.action === '*'))
    )
  })
}

export function createPermissionFromString(permissionString) {
  var parts = permissionString.split(':')

  if (parts.length === 2 || parts.length === 4) {
    // Did we include a type and package id
    if (
      parts[0] === constants.Roles.User ||
      parts[0] === constants.Roles.Supervisor ||
      parts[0] === constants.Roles.Administrator
    ) {
      // prepend grant and package
      parts.splice(0, 0, getConfiguration().PACKAGE_ID)
      parts.splice(0, 0, '+')
    }

    // Are tree parts included
    if (parts.length === 4) {
      // need to append '*:*'
      parts.push('*')
      parts.push('*')
    }
  }

  var retVal = {
    type: parts[0] === '+' ? constants.RoleTypes.Grant : constants.RoleTypes.Deny,
    package: parts[1],
    role: parts[2],
    action: parts[3],
    tree: parts[4],
    node: parts[5]
  }

  retVal = fillMissingPermissionValues(retVal)
  return retVal
}

export function fillMissingPermissionValues(permission) {
  if (!permission.type) {
    permission.type = constants.RoleTypes.Grant
  }
  if (!permission.package) {
    permission.package = getConfiguration().PACKAGE_ID
  }
  if (!permission.role) {
    permission.role = 'user'
  }
  if (!permission.action) {
    permission.action = '*'
  }
  if (!permission.tree) {
    permission.tree = '*'
  }
  if (!permission.node) {
    permission.node = '*'
  }

  return permission
}
