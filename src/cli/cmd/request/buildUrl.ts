export function buildUrl(url: string): URL {
  if (!url.match(/^https?:\/\//)) url = `http://${url}`
  return new URL(url)
}
