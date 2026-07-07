import { afterEach, expect, mock, test } from "bun:test"
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

test("cli prints stdout and exits with the result code", async () => {
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

test("cli prints stderr and exits with the result code", async () => {
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
