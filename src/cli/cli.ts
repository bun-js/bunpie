import { renderResponse } from "./cmd/request/renderResponse"
import { run } from "./run"

export async function cli(argv: string[]): Promise<never> {
  const result = await run(argv, {
    fetch,
    isTTY: Boolean(process.stdout.isTTY),
    renderResponse,
  })

  if (result.stdout !== undefined) console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)

  return process.exit(result.exitCode)
}
