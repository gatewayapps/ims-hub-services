import { ICachedNode } from './types/ICachedNode'
import { fetchCachedNodes } from './fetchCachedNodes'

export async function getNodeFromCache(nodeId: number): Promise<ICachedNode | undefined> {
  const remoteNodes = await fetchCachedNodes([nodeId])

  if (remoteNodes.length > 0) {
    return remoteNodes[0]
  } else {
    return undefined
  }
}

export async function getNodesFromCache(
  nodeIds: number[]
): Promise<{ [key: number]: ICachedNode | undefined }> {
  const remoteNodes = await fetchCachedNodes(nodeIds)
  return remoteNodes.filter((node) => !!node)
}
