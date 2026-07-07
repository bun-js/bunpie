import { expect, test } from "bun:test"
import { version } from "../../package.json"
import { run } from "./run"

function fetcher(response = new Response()) {
  return ((..._args: Parameters<typeof fetch>) =>
    Promise.resolve(response)) as typeof fetch
}

const renderResponse = () => Promise.resolve("rendered")

test("run returns help when no args are provided", async () => {
  let called = 0
  const result = await run([], {
    fetch: ((..._args: Parameters<typeof fetch>) => {
      called += 1
      return Promise.resolve(new Response())
    }) as typeof fetch,
    isTTY: false,
    renderResponse,
  })

  expect(String(result.stdout)).toContain("bunpie")
  expect(result.exitCode).toBe(1)
  expect(called).toBe(0)
})

test("run returns explicit help successfully", async () => {
  const result = await run(["--help"], {
    fetch: fetcher(),
    isTTY: false,
    renderResponse,
  })

  expect(String(result.stdout)).toContain("bunpie")
  expect(result.exitCode).toBe(0)
})

test("run returns version", async () => {
  const result = await run(["--version"], {
    fetch: fetcher(),
    isTTY: false,
    renderResponse,
  })

  expect(result.stdout).toBe(`bunpie ${version}`)
  expect(result.exitCode).toBe(0)
})

test("run fetches and renders responses", async () => {
  let called = 0
  const result = await run(["example.com"], {
    fetch: ((..._args: Parameters<typeof fetch>) => {
      called += 1
      return Promise.resolve(new Response())
    }) as typeof fetch,
    isTTY: false,
    renderResponse,
  })

  expect(called).toBe(1)
  expect(result.stdout).toBe("rendered")
  expect(result.exitCode).toBe(0)
})

test("run reports parse errors", async () => {
  const result = await run(["--unknown"], {
    fetch: fetcher(),
    isTTY: false,
    renderResponse,
  })

  expect(result.stderr).toContain("Unknown option '--unknown'")
  expect(result.exitCode).toBe(1)
})

test("run reports missing URLs from request construction", async () => {
  const result = await run(["POST"], {
    fetch: fetcher(),
    isTTY: false,
    renderResponse,
  })

  expect(result.stderr).toBe("missing url: ")
  expect(result.exitCode).toBe(1)
})
