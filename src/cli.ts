import { args } from "./args"
import { buildRequest } from "./buildRequest"
import { renderResponse } from "./renderResponse"

export async function cli(argv: string[]) {
  try {
    const { values, positionals } = args(argv)
    if (values.version) {
      const { version } = await import("../package.json")
      console.log(`bunpie ${version}`)
      return process.exit(0)
    }
    if (values.help) {
      console.log(await renderHelp())
      return process.exit(0)
    }
    if (positionals.length === 0) {
      console.log(await renderHelp())
      return process.exit(1)
    }
    const request = buildRequest(positionals, values)
    const response = await fetch(request, { verbose: values.verbose })
    console.log(await renderResponse(response))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(msg)
    return process.exit(1)
  }
}

async function renderHelp() {
  const { help } = await import("./help")
  return help({ ansi: Boolean(process.stdout.isTTY) })
}
