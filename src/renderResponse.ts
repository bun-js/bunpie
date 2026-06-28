export async function renderResponse(response: Response) {
  const body = await response.text()
  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}
