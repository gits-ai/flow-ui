import { createBearStore } from "@/utils/create-bear-store"

const DEFAULT_LEAVES_SCRIPT = `
/**
 * 输出函数将影响消息对话的上下文
 * 当且仅当该函数能正常执行时，才能正常触发对话
 *
 * @param {
 *   id: string
 *   data: {
 *     title: string
 *     input: string
 *     output: string
 *   }
 * }[] nodes
 * @return string
 */
function outputFunction(nodes) {
  // 只有一个叶子结点的时候，该叶子结点的输出作为整张图的输出
  if(nodes.length === 1) return nodes[0].data.output
  
  // 有多个叶子结点的时候，合并多个叶子结点的输出
  return nodes.map((node) => \`[\${node.id}]:\\n\${node.data.output}\`).join("\\n\\n")
}
`.trim()

const useMergeLeavesScriptBear = createBearStore<string>()(
  "mergeLeavesScript",
  DEFAULT_LEAVES_SCRIPT,
  true,
)

export const useMergeLeavesScript = () => {
  const { setMergeLeavesScript } = useMergeLeavesScriptBear()
  const resetMergeLeavesScript = () => {
    setMergeLeavesScript(DEFAULT_LEAVES_SCRIPT)
  }

  return {
    ...useMergeLeavesScriptBear(),
    resetMergeLeavesScript,
  }
}
