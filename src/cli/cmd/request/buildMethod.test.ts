import { expect, test } from "bun:test"
import { buildMethod } from "./buildMethod"

test("buildMethod reads known methods without mutating args", () => {
  const args = ["patch", "example.com"]

  expect(buildMethod(args)).toBe("PATCH")
  expect(args).toEqual(["patch", "example.com"])
})

test("buildMethod supports head", () => {
  expect(buildMethod(["head", "example.com"])).toBe("HEAD")
})

test("buildMethod defaults to get when the first arg is not a method", () => {
  const args = ["example.com"]

  expect(buildMethod(args)).toBe("GET")
  expect(args).toEqual(["example.com"])
})
