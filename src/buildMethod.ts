const METHODS = new Set([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
])

export function buildMethod(args: readonly string[]) {
  const method = args[0]?.toUpperCase()
  if (isMethod(method)) return method

  return "GET"
}

export function isMethod(value: string | undefined): value is string {
  return value ? METHODS.has(value.toUpperCase()) : false
}
