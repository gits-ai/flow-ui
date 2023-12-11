import { env } from "@/env.mjs"
import { ChatCompletionCreateParams } from "openai/resources/chat/completions"
import OpenAI from "openai"

export const serverFetchOpenAI = async ({
  apiBase = env.OPENAI_API_BASE,
  apiKey = env.OPENAI_API_KEY,
  data,
  timeout = 3000,
  httpAgent = undefined,
  stream = true,
}: {
  apiBase?: string
  apiKey?: string
  data: ChatCompletionCreateParams
  timeout?: number
  // todo: stream or not
  stream?: true

  /**
   *
   * ref:
   *  - https://github.com/openai/openai-node/tree/v4#configuring-an-https-agent-eg-for-proxies
   *  - https://github.com/openai/openai-node/issues/85
   *  - https://www.npmjs.com/package/https-proxy-agent
   *
   * edge 环境中 不支持 http / https-proxy-agent 等库
   *
   * 大陆服务器需要开启 clash tun mode !
   */
  httpAgent?: any
}) => {
  data.messages = data.messages.map(({ role, content }) => ({ role, content }))
  data.model = data.model ?? "gpt-3.5-turbo"

  console.log(`\n---------------------\n-- calling LLM: `, {
    apiBase,
    apiKey,
    data,
    timeout,
    httpAgent,
    stream,
  })

  return new OpenAI({
    baseURL: apiBase,
    apiKey,
    timeout,
    httpAgent,
  }).chat.completions.create({
    ...data,
    stream,
  })
}
