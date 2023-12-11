import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"
import { APIError as OpenAIAPIError } from "openai"

import { serverFetchOpenAI } from "@/utils/fetch-openai"

export const runtime = "edge" // IMPORTANT! nodejs 好像不支持 stream ！

/**
 * ref:
 *  ChatOpenAI + StreamingTextResponse: https://sdk.vercel.ai/docs/api-reference/langchain-stream
 *
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const response = await serverFetchOpenAI({
      // frontend-header --> env
      apiBase: req.headers.get("api-base") || undefined,
      apiKey: req.headers.get("api-key") || undefined,
      data: await req.json(),
    })
    // todo: incorrect response inference
    // @ts-ignore
    const openAIStream = OpenAIStream(response, {})

    return new StreamingTextResponse(openAIStream, {})
  } catch (e) {
    console.log({ e })
    if (e instanceof OpenAIAPIError)
      return NextResponse.json(
        `OpenAI响应错误，请稍后再试！错误原因：${e.message}`,
        {
          status: 400,
        },
      )

    return NextResponse.json("服务器未知错误，请稍后再试！", {
      status: 400,
    })
  }
}
