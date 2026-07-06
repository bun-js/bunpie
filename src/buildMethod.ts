const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

export function buildMethod(args: string[]) {
  if (args[0]) {
    const method = args[0].toUpperCase()
    if (METHODS.has(method)) {
      args.shift()
      return method
    }
  }

  return "GET"
}
