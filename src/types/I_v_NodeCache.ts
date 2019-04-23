export interface I_v_NodeCache {
  nodeId: number
  name: string
  nodeDetailTypeId: number
  nodeTypeId: number
  treeId: number
  parent: number
  rank: number
  isDeleted: boolean
  MaxDepth?: number | null
}
