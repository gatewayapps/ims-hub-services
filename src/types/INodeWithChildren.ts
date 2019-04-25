import { I_v_NodeCache } from './I_v_NodeCache'

export interface INodeWithChildren extends I_v_NodeCache {
  children?: INodeWithChildren[]
}
