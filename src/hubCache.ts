const debug = require('debug')('ims-hub-services')

import { createClient } from 'redis'

import { ICachedNode, I_v_UserAccount, ICompactNode, constants } from '.'

let instance: HubCache | undefined = undefined
export type RedisClient = ReturnType<typeof createClient>
export type ClientOpts = {
  username?: string
  password?: string
  hostname?: string
}
export class HubCache {
  protected redisClient!: RedisClient
  private redisSubscriptionClient!: RedisClient
  protected lastUpdatedAt: number = 0

  // Map of nodeIds to ICachedNode
  protected nodeHashMap: { [key: number]: ICachedNode } = {}

  // Map of nodeIds to I_v_UserAccounts
  protected userHashMap: { [key: number]: I_v_UserAccount } = {}

  // Map of userAccountIds to nodeIds
  protected userNodeHashMap: { [key: number]: number } = {}

  // Array of nodeIds in order of MaxDepth descending
  protected orderedNodeIds: number[] = []

  protected nodeArrayContainsAncestor(node: ICachedNode, nodeIds: number[]) {
    return nodeIds.some((possibleAncestor) => node && node.ancestorIds!.includes(possibleAncestor))
  }

  /**
   * Iterates over rootNode ids and removes any that are inherited from other root nodes
   * @param rootNodeIds array of requested nodeIds
   * @returns number[] Array of distinct root node ids
   */
  protected removeOverlappingRoots(rootNodeIds: number[]): number[] {
    return rootNodeIds.filter(
      (rootId) => !this.nodeArrayContainsAncestor(this.nodeHashMap[rootId], rootNodeIds)
    )
  }

  /**
   * @param node Root node to filter descendants from
   * @param excludedNodeIds Array of nodeIds that are explicitly excluded
   * @returns number[] Array of valid descendant node ids
   */
  protected applyExclusionsToNodeDescendants(
    node: ICachedNode,
    excludedNodeIds: number[]
  ): number[] {
    if (!node) {
      return []
    }

    const result = node.descendantIds!.filter(
      (id) =>
        // Ensure none of this descendants ancestors appear in the exclusion list
        this.nodeHashMap[id] &&
        !this.nodeHashMap[id].ancestorIds!.some((ancestor) => excludedNodeIds.includes(ancestor)) &&
        // Ensure this descendant is not in the exclusion list
        !excludedNodeIds.includes(id)
    )

    return result
  }

  /**
   *
   * @param rootNodeIds Array of node ids to get descendants from
   * @param excludedNodeIds Array of node ids to exclude. This will also exclude any descendants of those nodes
   * @returns number[][] Array of arrays of nodeIds that are ordered by maxDepth descending
   */
  protected filterAndOrderNodeIds(
    rootNodeIds: number[],
    excludedNodeIds: number[] = [],
    treeId: number
  ): number[][] {
    const distinctRoots = this.removeOverlappingRoots(rootNodeIds)
    const finalRoots = distinctRoots.filter(
      (rootId) => !excludedNodeIds.includes(rootId) && this.nodeHashMap[rootId]
    )

    const validDescendantArrays = finalRoots.map((root) =>
      this.applyExclusionsToNodeDescendants(this.nodeHashMap[root], excludedNodeIds)
    )

    // Add rootId to validDescendant arrays
    for (let i = 0; i < finalRoots.length; i++) {
      validDescendantArrays[i].push(finalRoots[i])
    }

    return validDescendantArrays.map((descendants) => {
      return this.orderedNodeIds.filter(
        (oi) => descendants.includes(oi) && this.nodeHashMap[oi].treeId === treeId
      )
    })
  }

  public getNodeAncestorIds(nodeId: number): number[] {
    const node = this.nodeHashMap[nodeId]
    if (node) {
      return node.ancestorIds || []
    } else {
      return []
    }
  }

  public getNodeDescendantIds(nodeId: number): number[] {
    const node = this.nodeHashMap[nodeId]
    if (node) {
      return node.descendantIds || []
    } else {
      return []
    }
  }

  public getLineageForNode(nodeId: number): { [key: number]: ICompactNode } {
    const node = this.nodeHashMap[nodeId]
    if (!node) {
      return []
    } else {
      const result: { [key: number]: ICompactNode } = {}

      const ancestors = node.ancestorIds || []
      const descendants = node.descendantIds || []

      ancestors.map((anc) => (result[anc] = this.compactNode(this.nodeHashMap[anc])))
      result[nodeId] = this.compactNode(node)
      descendants.map((des) => (result[des] = this.compactNode(this.nodeHashMap[des])))

      return result
    }
  }

  public getCachedUsers(userAccountIds: number[]): I_v_UserAccount[] {
    return userAccountIds.map(
      (userAccountId) => this.userHashMap[this.userNodeHashMap[userAccountId]]
    )
  }

  public getCachedNodes(nodeIds: number[]): ICachedNode[] {
    return nodeIds.map((nodeId) => this.nodeHashMap[nodeId])
  }

  protected compactNode(node: ICachedNode): ICompactNode {
    return {
      name: node.name,
      nodeDetailTypeId: node.nodeDetailTypeId,
      nodeTypeId: node.nodeTypeId,
      parent: node.parent,
      nodeId: node.nodeId
    }
  }

  public getOrderedNodeIds(
    rootNodeIds: number[],
    excludedNodeIds: number[] = [],
    treeId: number
  ): number[] {
    const orderedNodeArrays = this.filterAndOrderNodeIds(rootNodeIds, excludedNodeIds, treeId)
    return orderedNodeArrays.reduce<number[]>((result, nodeIdArray) => {
      result.push(...nodeIdArray)
      return result
    }, [])
  }

  public getNodes(
    rootNodeIds: number[],
    excludedNodeIds: number[] = [],
    treeId: number
  ): { [key: number]: ICachedNode } {
    const orderedNodeArrays = this.filterAndOrderNodeIds(rootNodeIds, excludedNodeIds, treeId)
    return orderedNodeArrays.reduce<{ [key: number]: ICachedNode }>(
      (result, nodeIdArray: number[]) => {
        for (let i = 0; i < nodeIdArray.length; i++) {
          result[nodeIdArray[i]] = this.nodeHashMap[nodeIdArray[i]]
        }

        return result
      },
      {}
    )
  }

  public getDescendantUsers(rootNodeIds: number[], excludedNodeIds: number[]): I_v_UserAccount[] {
    const nodeIds = this.getOrderedNodeIds(rootNodeIds, excludedNodeIds, 1)
    return nodeIds
      .filter((nodeId) => this.userHashMap[nodeId])
      .map((nodeId) => this.userHashMap[nodeId])
  }

  public getNodesOfType(nodeTypeId: number) {
    return this.orderedNodeIds
      .map((nodeId) => this.nodeHashMap[nodeId])
      .filter((node) => node.nodeTypeId === nodeTypeId)
  }

  public getDescendantUserAccountIds(rootNodeIds: number[], excludedNodeIds: number[]): number[] {
    const nodeIds = this.getOrderedNodeIds(rootNodeIds, excludedNodeIds, 1)
    return nodeIds
      .filter((nodeId) => this.userHashMap[nodeId])
      .map((nodeId) => this.userHashMap[nodeId].userAccountId)
  }

  public getRootNodeIdsForTree(treeId: number): number[] {
    return this.orderedNodeIds
      .map((nodeId) => this.nodeHashMap[nodeId])
      .filter((node) => node.treeId === treeId && node.parent === 0)
      .map((node) => node.nodeId)
  }

  constructor(redisOptions: ClientOpts, isConsumer: boolean = true) {
    debug(`HubCache constructor - isConsumer: ${isConsumer}`)
    this.initializeRedisConnection(redisOptions)
      .then(async () => {
        if (isConsumer) {
          // We should  start an interval to update the cache regularly
          // Every 30 minutes we should force an update
          setInterval(this.loadNodeCache, 60000 * 30)

          await this.redisSubscriptionClient.connect()

          this.redisSubscriptionClient.subscribe(
            constants.RedisNodeCacheChannel,
            async (message, channel) => {
              if (message === constants.RedisNodeCacheUpdatedMessage) {
                console.info('Loading cache from redis trigger')
                await this.loadNodeCache()
              }
            }
          )
          this.loadNodeCache()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  protected async initializeRedisConnection(opts: ClientOpts) {
    if (!this.redisClient) {
      this.redisClient = createClient(opts)
      this.redisSubscriptionClient = createClient(opts)
      this.redisClient.on('error', (message) => {
        console.error(message)
      })
      await this.redisClient.connect()
    }
  }

  public loadNodeCache = async () => {
    debug(`loadNodeCache`)

    try {
      const jsonValue = await this.redisClient.get(constants.RedisNodeCacheKey)
      if (jsonValue === null) {
        console.error(`No cache value found with key ${constants.RedisNodeCacheKey}`)
        return
      }
      const data = JSON.parse(jsonValue)

      const cacheData: {
        nodeHashMap: {
          [key: number]: ICachedNode
        }
        userHashMap: {
          [key: number]: I_v_UserAccount
        }
        userNodeHashMap: {
          [key: number]: number
        }
        orderedNodeIds: number[]
        lastUpdatedAt: number
      } = data

      debug('Updating local cache with new data')

      this.nodeHashMap = cacheData.nodeHashMap
      this.userHashMap = cacheData.userHashMap
      this.userNodeHashMap = cacheData.userNodeHashMap
      this.orderedNodeIds = cacheData.orderedNodeIds
      this.lastUpdatedAt = cacheData.lastUpdatedAt
    } catch (err) {
      console.error(err)
      this.lastUpdatedAt = 0
    }
  }
  public getLastUpdatedAt = () => this.lastUpdatedAt
}
export const getCacheInstance = () => {
  if (!instance) {
    // const hostname = process.env.REDIS_HOSTNAME || 'localhost'
    const username = process.env.REDIS_USERNAME || 'ims-package'
    const password = process.env.REDIS_PASSWORD || 'IMS_PACKAGE'

    instance = new HubCache({ username, password }, true)
  }
  return instance
}
