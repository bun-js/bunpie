import { afterEach, expect, mock, test } from "bun:test"
import { version } from "../package.json"
import { cli } from "./cli"

const originalExit = process.exit
const originalFetch = globalThis.fetch
const originalLog = console.log
const originalError = console.error

afterEach(() => {
  process.exit = originalExit
  globalThis.fetch = originalFetch
  console.log = originalLog
  console.error = originalError
  mock.restore()
})

test("cli prints help when no args are provided", async () => {
  let logged = ""
  let exitCode: number | undefined
  let called = 0
  console.log = ((value: unknown) => {
    logged = String(value)
  }) as typeof console.log
  process.exit = ((code?: number) => {
    exitCode = code
  }) as typeof process.exit
  globalThis.fetch = ((..._args: Parameters<typeof fetch>) => {
    called += 1
    return Promise.resolve(new Response())
  }) as typeof fetch

  await cli([])
  expect(logged).toContain("bunpie")
  expect(exitCode).toBe(1)
  expect(called).toBe(0)
})

test("cli prints explicit help and exits successfully", async () => {
  let logged = ""
  let exitCode: number | undefined
  console.log = ((value: unknown) => {
    logged = String(value)
  }) as typeof console.log
  process.exit = ((code?: number) => {
    exitCode = code
  }) as typeof process.exit

  await cli(["--help"])
  expect(logged).toContain("bunpie")
  expect(exitCode).toBe(0)
})

test("cli prints version and exits", async () => {
  let logged = ""
  let exitCode: number | undefined
  console.log = ((value: unknown) => {
    logged = String(value)
  }) as typeof console.log
  process.exit = ((code?: number) => {
    exitCode = code
  }) as typeof process.exit

  await cli(["--version"])
  expect(logged).toBe(`bunpie ${version}`)
  expect(exitCode).toBe(0)
})

test("cli fetches and renders responses", async () => {
  let _logged = ""
  let called = 0
  console.log = ((value: unknown) => {
    _logged = String(value)
  }) as typeof console.log
  globalThis.fetch = ((..._args: Parameters<typeof fetch>) => {
    called += 1
    return Promise.resolve(new Response(JSON.stringify({ ok: true })))
  }) as typeof fetch

  await cli(["example.com"])

  expect(called).toBe(1)
})

test("cli reports parse errors", async () => {
  let message = ""
  let exitCode: number | undefined
  console.error = ((value: unknown) => {
    message = String(value)
  }) as typeof console.error
  process.exit = ((code?: number) => {
    exitCode = code
  }) as typeof process.exit

  await cli(["--unknown"])
  expect(message).toContain("Unknown option '--unknown'")
  expect(exitCode).toBe(1)
})

test("cli reports missing URLs from request construction", async () => {
  let message = ""
  let exitCode: number | undefined
  console.error = ((value: unknown) => {
    message = String(value)
  }) as typeof console.error
  process.exit = ((code?: number) => {
    exitCode = code
  }) as typeof process.exit

  await cli(["POST"])
  expect(message).toBe("missing url: ")
  expect(exitCode).toBe(1)
})
