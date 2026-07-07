import { expect, test } from "bun:test"
import { requestCommand } from "./requestCommand"

const opts = {
  follow: false,
  form: false,
  json: true,
  verbose: true,
}

test("requestCommand() fetches, renders, and returns a successful result", async () => {
  let requestUrl = ""
  let verbose: unknown
  let renderedResponse: Response | undefined
  const fetcher = ((request: Request, init?: Parameters<typeof fetch>[1]) => {
    requestUrl = request.url
    verbose = (init as { verbose?: unknown } | undefined)?.verbose
    return Promise.resolve(new Response())
  }) as typeof fetch

  const result = await requestCommand({
    fetch: fetcher,
    opts,
    positionals: ["example.com", "q==bun"],
    renderResponse: async (response) => {
      renderedResponse = response
      return { ok: true }
    },
  })

  expect(requestUrl).toBe("http://example.com/?q=bun")
  expect(verbose).toBe(true)
  expect(renderedResponse).toBeInstanceOf(Response)
  expect(result).toEqual({
    stdout: { ok: true },
    exitCode: 0,
  })
})
