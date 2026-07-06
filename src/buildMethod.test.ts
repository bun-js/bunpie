import { expect, test } from "bun:test"
import { buildMethod } from "./buildMethod"

test("buildMethod consumes known methods", () => {
  const args = ["patch", "example.com"]

  expect(buildMethod(args)).toBe("PATCH")
  expect(args).toEqual(["example.com"])
})

test("buildMethod defaults to get when the first arg is not a method", () => {
  const args = ["example.com"]

  expect(buildMethod(args)).toBe("GET")
  expect(args).toEqual(["example.com"])
})
