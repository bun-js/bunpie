import { afterEach, expect, mock, test } from "bun:test"
import { buildRequest } from "./buildRequest"

const originalExit = process.exit
const originalError = console.error

afterEach(() => {
  process.exit = originalExit
  console.error = originalError
  mock.restore()
})

test("buildRequest uses GET when the first item is a url", () => {
  const request = buildRequest(["example.com"])

  expect(request.method).toBe("GET")
  expect(request.url).toBe("http://example.com/")
})

test("buildRequest normalizes explicit methods", () => {
  const request = buildRequest(["post", "example.com/api"])

  expect(request.method).toBe("POST")
  expect(request.url).toBe("http://example.com/api")
})

test("buildRequest exits when a method has no url", () => {
  const error = mock(() => {})
  const exit = mock(() => {
    throw new Error("exit 1")
  })
  console.error = error as unknown as typeof console.error
  process.exit = exit as unknown as typeof process.exit

  expect(() => buildRequest(["POST"])).toThrow("exit 1")
  expect(error).toHaveBeenCalledWith("missing url")
  expect(exit).toHaveBeenCalledWith(1)
})
