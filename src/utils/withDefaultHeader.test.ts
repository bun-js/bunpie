import { expect, test } from "bun:test"
import { withDefaultHeader } from "./withDefaultHeader"

test("withDefaultHeader returns headers with missing defaults", () => {
  const headers = new Headers()
  const next = withDefaultHeader(headers, "accept", "application/json")

  expect(next).not.toBe(headers)
  expect(headers.get("accept")).toBeNull()
  expect(next.get("accept")).toBe("application/json")
})

test("withDefaultHeader does not override existing headers", () => {
  const headers = new Headers({ Accept: "text/plain" })
  const next = withDefaultHeader(headers, "accept", "application/json")

  expect(next).not.toBe(headers)
  expect(headers.get("accept")).toBe("text/plain")
  expect(next.get("accept")).toBe("text/plain")
})
