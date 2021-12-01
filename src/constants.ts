export default {
  Roles: {
    Administrator: 'admin',
    Supervisor: 'super',
    User: 'user'
  },
  RoleTypes: {
    Grant: 1,
    Deny: -1
  },
  RoleValues: {
    user: 1,
    super: 2,
    admin: 3
  },
  SignatureHeader: 'x-ims-signature',
  AuthorizationHeader: 'x-ims-authorization',
  PackageIdHeader: 'x-ims-package-id',
  AuthorizationType: 'JWT',
  RedisNodeCacheChannel: 'NODE_CACHE',
  RedisNodeCacheUpdatedMessage: 'CACHE_UPDATED',
  RedisNodeCacheKey: 'NODE_CACHE'
}
