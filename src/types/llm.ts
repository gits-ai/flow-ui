export type LLM = {
  headers?: {
    apiBase?: string | undefined
    apiKey?: string | undefined
  }

  body?: {
    model: string
  }
}
