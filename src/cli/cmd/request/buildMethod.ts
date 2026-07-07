const METHODS = new Set([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
])

export function buildMethod(args: readonly string[]): string {
  const method = args[0]?.toUpperCase()
  if (method && METHODS.has(method)) return method

  return "GET"
}
