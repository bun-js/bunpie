import { parseJsonOrText } from "../../../utils/parseJsonOrText"

export async function renderResponse(
  response: Response,
  { headers = false }: { headers?: boolean } = {},
): Promise<unknown> {
  const body = await response.text()
  if (headers) {
    const responseHeaders = [...response.headers]
      .map(([name, value]) => `${name}: ${value}`)
      .join("\n")
    const statusLine = [response.status, response.statusText].filter(Boolean).join(" ")
    const metadata = [`HTTP ${statusLine}`, responseHeaders]
      .filter(Boolean)
      .join("\n")
    return `${metadata}\n\n${body}`
  }
  return parseJsonOrText(body)
}
