import { parseJsonOrText } from "../../../utils/parseJsonOrText"

export async function renderResponse(response: Response): Promise<unknown> {
  const body = await response.text()
  return parseJsonOrText(body)
}
