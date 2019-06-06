import { INodeWithChildren } from './types/INodeWithChildren'
import { fetchTreeData } from './fetchTreeData'
import { buildTreeFromOrderedNodeIds } from './buildTreeFromOrderedNodeIds'

export async function fetchTree(
  includeNodes: (string | number)[] = [],
  excludeNodes: (string | number)[] = [],
  treeId: number = 1
): Promise<INodeWithChildren[]> {
  const treeData = await fetchTreeData(includeNodes, excludeNodes, treeId)
  return buildTreeFromOrderedNodeIds(treeData.orderedNodeIds, treeData.nodeHashMap)
}
