export const ORDERED_NODE_IDS_10 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
export const NODE_HASH_MAP_10 = {
  10: {
    parent: 7,
    nodeId: 10
  },
  9: {
    parent: 8,
    nodeId: 9
  },
  8: {
    parent: 7,
    nodeId: 8
  },
  7: {
    parent: 2,
    nodeId: 7
  },
  6: {
    parent: 3,
    nodeId: 6
  },
  5: {
    parent: 3,
    nodeId: 5
  },
  4: {
    parent: 3,
    nodeId: 4
  },
  3: {
    parent: 1,
    nodeId: 3
  },
  2: {
    parent: 1,
    nodeId: 2
  },
  1: {
    parent: 0,
    nodeId: 1
  }
}
export const DESIRED_TREE_10 = [
  {
    nodeId: 1,
    parent: 0,
    children: [
      {
        parent: 1,
        nodeId: 3,
        children: [
          {
            parent: 3,
            nodeId: 6,
            children: []
          },
          {
            parent: 3,
            nodeId: 5,
            children: []
          },
          {
            parent: 3,
            nodeId: 4,
            children: []
          }
        ]
      },
      {
        parent: 1,
        nodeId: 2,
        children: [
          {
            parent: 2,
            nodeId: 7,
            children: [
              {
                parent: 7,
                nodeId: 10,
                children: []
              },
              {
                parent: 7,
                nodeId: 8,
                children: [
                  {
                    parent: 8,
                    nodeId: 9,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
