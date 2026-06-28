import { buildUrl } from "./buildUrl"

const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

export function buildRequest(args: string[]) {
  let method = args.shift()
  let url = ""
  if (method) {
    if (METHODS.has(method.toUpperCase())) {
      method = method.toUpperCase()
      url = args.shift() ?? missingUrl()
    } else {
      url = method
      method = "GET"
    }
  }

  const Url = buildUrl(url)
  const init = {
    method,
  }

  return new Request(Url.toString(), init)
}

function missingUrl(): never {
  console.error("missing url")
  process.exit(1)
}
