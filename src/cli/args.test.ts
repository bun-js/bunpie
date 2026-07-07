import { expect, test } from "bun:test"
import { args } from "./args"

test("args parses positionals and options", () => {
  const result = args(["-v", "get", "example.com"])

  expect(result.values.verbose).toBe(true)
  expect(result.positionals).toEqual(["get", "example.com"])
})

test("args allows negative positionals", () => {
  const result = args(["--", "-path"])

  expect(result.positionals).toEqual(["-path"])
})
