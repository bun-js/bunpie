import { expect, test } from "bun:test"
import { buildUrl } from "./buildUrl"

test("buildUrl prefixes plain hosts with http", () => {
  expect(buildUrl("example.com").toString()).toBe("http://example.com/")
})

test("buildUrl keeps existing schemes", () => {
  expect(buildUrl("https://example.com/path").toString()).toBe(
    "https://example.com/path",
  )
})
