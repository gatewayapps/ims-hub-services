const debug = require('debug')('ims-hub-services')
import { ICachedNode, I_v_UserAccount, ICompactNode } from '.'
import { sendHubRequest } from './request'

let instance: HubCache | undefined = undefined

export class HubCache {
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
    return nodeIds.some((possibleAncestor) => node.ancestorIds!.includes(possibleAncestor))
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
    const result = node.descendantIds!.filter(
      (id) =>
        // Ensure none of this descendants ancestors appear in the exclusion list
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
    const finalRoots = distinctRoots.filter((rootId) => !excludedNodeIds.includes(rootId))

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
    if (userAccountIds.length === 0) {
      return Object.values(this.userHashMap)
    }
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

  constructor(isConsumer: boolean = true) {
    debug(`HubCache constructor - isConsumer: ${isConsumer}`)
    if (isConsumer) {
      // We should  start an interval to update the cache regularly
      // Every 1 minute check with the hub for new data
      setInterval(this.loadNodeCache, 60000)
      this.loadNodeCache()
    }
  }

  public async loadNodeCache() {
    console.log('LOAD NODE CACHE CALLED')
    debug(`loadNodeCache`)
    const endpoint = `/api/hubServices/refreshHubData`

    const result = await sendHubRequest(endpoint, 'POST', { lastUpdated: this.lastUpdatedAt })

    if (result.success) {
      if (!result.data) {
        // no new data
      } else {
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
        } = result.data

        debug('Updating local cache with new data')

        this.nodeHashMap = cacheData.nodeHashMap
        this.userHashMap = cacheData.userHashMap
        this.userNodeHashMap = cacheData.userNodeHashMap
        this.orderedNodeIds = cacheData.orderedNodeIds
        this.lastUpdatedAt = cacheData.lastUpdatedAt
      }
    } else {
      throw result.error
    }
  }
  public getLastUpdatedAt = () => this.lastUpdatedAt
}
export const getCacheInstance = () => {
  debug('Requesting instance of HubCache')
  if (!instance) {
    instance = new HubCache(true)
  }
  return instance
}
