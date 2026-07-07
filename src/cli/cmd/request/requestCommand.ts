import type { ArgOpts } from "../../args"
import type { CommandResult, Fetcher, ResponseRenderer } from "../types"
import { buildRequest } from "./buildRequest"

type RequestCommandOptions = {
  fetch: Fetcher
  opts: ArgOpts
  positionals: string[]
  renderResponse: ResponseRenderer
}

export async function requestCommand({
  fetch,
  opts,
  positionals,
  renderResponse,
}: RequestCommandOptions): Promise<CommandResult> {
  const request = buildRequest(positionals, opts)
  const response = await fetch(request, { verbose: opts.verbose })

  return {
    stdout: await renderResponse(response),
    exitCode: 0,
  }
}
