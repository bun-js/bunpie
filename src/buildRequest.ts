import type { ArgOpts } from "./args"
import { buildInit } from "./buildInit"
import { buildMethod, isMethod } from "./buildMethod"
import { buildUrl } from "./buildUrl"

export function buildRequest(args: string[], opts: ArgOpts) {
  const method = buildMethod(args)
  const requestArgs = isMethod(args[0]) ? args.slice(1) : [...args]
  const [url, ...requestItems] = requestArgs
  if (!url) missingUrl(requestArgs)
  const requestUrl = buildUrl(url)
  const { url: finalUrl, init } = buildInit(requestItems, requestUrl, opts)
  init.method = method
  if (method === "GET" && init.body) init.method = "POST"
  init.redirect = opts.follow ? "follow" : "manual"
  return new Request(finalUrl.toString(), init)
}

function missingUrl(args: string[]): never {
  throw new Error(`missing url: ${args.join(" ")}`)
}
