import { ICachedNode } from './types/ICachedNode'
import { INodeWithChildren } from './types/INodeWithChildren'

export function buildTreeFromOrderedNodeIds(
  orderedNodeIds: number[],
  nodeHashMap: { [key: number]: Partial<ICachedNode> }
): INodeWithChildren[] {
  const rootTree = orderedNodeIds.reduce<{ [key: number]: INodeWithChildren }>(
    (result, nodeId: number) => {
      let { descendantIds, ancestorIds, ...nodeRef } = nodeHashMap[nodeId]
      const node = nodeRef as INodeWithChildren
      node.children = []

      if (nodeHashMap[node.parent]) {
        //this is a child node in our context
        if (!result[node.parent]) {
          let { descendantIds, ancestorIds, ...parentNodeRef } = nodeHashMap[node.parent]
          const parentNode = parentNodeRef as INodeWithChildren
          parentNode.children = []
          result[node.parent] = parentNode
        }

        if (result[nodeId]) {
          result[node.parent].children!.push(result[nodeId])
          delete result[nodeId]
        } else {
          result[node.parent].children!.push(node)
        }
      }
      return result
    },
    {}
  )

  return Object.values(rootTree)
}
