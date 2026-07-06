import { args } from "./args"
import { buildRequest } from "./buildRequest"
import { renderResponse } from "./renderResponse"

export async function cli(argv: string[]) {
  try {
    const { values, positionals } = args(argv)
    if (values.version) {
      const { version } = await import("../package.json")
      console.log(`bunpie ${version}`)
      process.exit()
    }
    if (values.help || positionals.length === 0) {
      console.log((await import("./help")).help())
      process.exit(1)
    }
    const request = buildRequest(positionals, values)
    const response = await fetch(request, { verbose: values.verbose })
    console.log(await renderResponse(response))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(msg)
    process.exit(1)
  }
}
