import { I_v_NodeCache } from './I_v_NodeCache'

export interface ICachedNode extends I_v_NodeCache {
  ancestorIds?: number[]
  descendantIds?: number[]
}
