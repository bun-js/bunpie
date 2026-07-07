export function withDefaultHeader(
  headers: Headers,
  name: string,
  value: string,
): Headers {
  const next = new Headers(headers)
  if (!next.has(name)) next.set(name, value)
  return next
}
