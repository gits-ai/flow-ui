export const NodeDataTransferTag = "application/reactflow/nodes"

export enum NodeCategory {
  Function = "Function",
  Agent = "Agent",
}

export const NODE_TYPES: {
  category: NodeCategory
  name: string
}[] = [
  {
    category: NodeCategory.Agent,
    name: "SimpleAgent",
  },

  {
    category: NodeCategory.Agent,
    name: "TemplateAgent",
  },

  {
    category: NodeCategory.Function,
    name: "End",
  },
]

// prevent scroll to be propagated, ref: https://github.com/xyflow/xyflow/discussions/2372
export const CLASSNAME_NODRAG = "nowheel nodrag"
