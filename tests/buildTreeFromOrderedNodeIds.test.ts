import { buildTreeFromOrderedNodeIds } from '../src/buildTreeFromOrderedNodeIds'
import { NODE_HASH_MAP_10, ORDERED_NODE_IDS_10, DESIRED_TREE_10 } from './testConstants'

test('builds tree correctly', () => {
  expect(buildTreeFromOrderedNodeIds(ORDERED_NODE_IDS_10, NODE_HASH_MAP_10)).toMatchObject(
    DESIRED_TREE_10
  )
})
