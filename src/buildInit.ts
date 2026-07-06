import type { ArgOpts } from "./args"

export function buildInit(
  args: string[],
  url: URL,
  opts: ArgOpts,
): RequestInit {
  const headers = new Headers()
  const form = new FormData()
  const payload: Record<string, unknown> = {}

  for (const arg of args) {
    if (arg.includes("==")) {
      const [key, value] = arg.split("==", 2)
      if (key && value) url.searchParams.append(key, value)
    } else if (arg.includes(":=")) {
      const [key, value] = arg.split(":=", 2)
      if (key && value) payload[key] = parseValue(value)
    } else if (arg.includes(":")) {
      const [key, value] = arg.split(":", 2)
      if (key && value) headers.append(key, value)
    } else if (arg.includes("=")) {
      const [key, value] = arg.split("=", 2)
      if (key && value) {
        form.append(key, value)
        payload[key] = value
      }
    }
  }

  const body = opts.form
    ? form
    : emptyObj(payload)
      ? undefined
      : JSON.stringify(payload)

  if (opts.form) {
    headers.append("content-type", "application/x-www-form-urlencoded")
  } else if (opts.json) {
    headers.append("content-type", "application/json")
    headers.append("accept", "application/json")
  }

  return {
    headers,
    body,
  }
}

function parseValue(v: string) {
  try {
    return JSON.parse(v)
  } catch {
    return v
  }
}

function emptyObj(obj: Record<string, unknown>) {
  return Object.keys(obj).length === 0
}
