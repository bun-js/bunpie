import type { ArgOpts } from "../../args"
import { buildInit } from "./buildInit"
import { buildMethod } from "./buildMethod"
import { buildUrl } from "./buildUrl"

export function buildRequest(args: string[], opts: ArgOpts): Request {
  const method = buildMethod(args)
  const requestArgs =
    args[0]?.toUpperCase() === method ? args.slice(1) : [...args]
  const [url, ...requestItems] = requestArgs
  if (!url) throw new Error(`missing url: ${requestArgs.join(" ")}`)
  const requestUrl = buildUrl(url)
  const { url: finalUrl, init } = buildInit(requestItems, requestUrl, opts)
  init.method = method
  if (method === "GET" && init.body) init.method = "POST"
  init.redirect = opts.follow ? "follow" : "manual"
  return new Request(finalUrl.toString(), init)
}
