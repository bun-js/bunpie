export function withDefaultHeader(
  headers: Headers,
  name: string,
  value: string,
) {
  const next = new Headers(headers)
  if (!next.has(name)) next.set(name, value)
  return next
}
