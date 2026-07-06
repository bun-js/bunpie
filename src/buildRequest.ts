import type { ArgOpts } from "./args"
import { buildInit } from "./buildInit"
import { buildMethod } from "./buildMethod"
import { buildUrl } from "./buildUrl"

export function buildRequest(args: string[], opts: ArgOpts) {
  const method = buildMethod(args)
  const url = args[0]
  if (!url) missingUrl(args)
  args.shift()
  const Url = buildUrl(url)
  const init = buildInit(args, Url, opts)
  init.method = method
  if (method === "GET" && init.body) init.method = "POST"
  if (opts.follow) init.redirect = "follow"
  return new Request(Url.toString(), init)
}

function missingUrl(args: string[]): never {
  console.error(`missing url: ${args.join(" ")}`)
  process.exit(1)
}
