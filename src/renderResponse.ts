import { parseJsonOrText } from "./utils/parseJsonOrText"

export async function renderResponse(response: Response) {
  const body = await response.text()
  return parseJsonOrText(body)
}
