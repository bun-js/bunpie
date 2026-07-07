import { args } from "./args"
import { helpCommand } from "./cmd/help/helpCommand"
import { requestCommand } from "./cmd/request/requestCommand"
import type { CommandResult, Fetcher, ResponseRenderer } from "./cmd/types"
import { versionCommand } from "./cmd/version/versionCommand"

type RunDeps = {
  fetch: Fetcher
  isTTY: boolean
  renderResponse: ResponseRenderer
}

export async function run(
  argv: string[],
  deps: RunDeps,
): Promise<CommandResult> {
  try {
    const { values, positionals } = args(argv)

    if (values.version) return versionCommand()
    if (values.help) return helpCommand({ exitCode: 0, isTTY: deps.isTTY })
    if (positionals.length === 0) {
      return helpCommand({ exitCode: 1, isTTY: deps.isTTY })
    }

    return await requestCommand({
      fetch: deps.fetch,
      opts: values,
      positionals,
      renderResponse: deps.renderResponse,
    })
  } catch (e: unknown) {
    return {
      stderr: e instanceof Error ? e.message : String(e),
      exitCode: 1,
    }
  }
}
