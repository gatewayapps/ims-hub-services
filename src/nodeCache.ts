import { ICachedNode } from './types/ICachedNode'
import { fetchCachedNodes } from './fetchCachedNodes'

export interface INodeCacheRecord {
  cachedAt: number
  record?: ICachedNode
}

const LocalCache: { [key: number]: INodeCacheRecord } = {}

const ONE_MINUTE_MILLIS = 60000
const FIVE_MINUTE_MILLIS = 300000

export async function getNodeFromCache(nodeId: number): Promise<ICachedNode | undefined> {
  const localCopy = LocalCache[nodeId]
  const currentMillis = new Date().getTime()
  if (localCopy && currentMillis - localCopy.cachedAt < ONE_MINUTE_MILLIS) {
    return localCopy.record
  }

  const remoteNodes = await fetchCachedNodes([nodeId])

  LocalCache[nodeId] = {
    cachedAt: currentMillis,
    record: remoteNodes.length > 0 ? remoteNodes[0] : undefined
  }

  return LocalCache[nodeId].record
}

export async function getNodesFromCache(
  nodeIds: number[]
): Promise<{ [key: number]: ICachedNode | undefined }> {
  const currentMillis = new Date().getTime()

  const nodesToFetch: number[] = []
  const result: { [key: number]: ICachedNode | undefined } = {}

  nodeIds.forEach((nodeId) => {
    const localCopy = LocalCache[nodeId]
    if (localCopy && currentMillis - localCopy.cachedAt < ONE_MINUTE_MILLIS) {
      result[nodeId] = localCopy.record
    } else {
      nodesToFetch.push(nodeId)
    }
  })

  if (nodesToFetch.length > 0) {
    const remoteNodes = await fetchCachedNodes(nodesToFetch)
    remoteNodes
      .filter((node) => !!node)
      .forEach((remoteNode) => {
        LocalCache[remoteNode.nodeId] = {
          cachedAt: currentMillis,
          record: remoteNode
        }
        result[remoteNode.nodeId] = remoteNode
      })
  }

  return result
}
