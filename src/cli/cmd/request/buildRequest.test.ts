import { expect, test } from "bun:test"
import { buildRequest } from "./buildRequest"

const baseOpts = {
  follow: false,
  form: false,
  json: true,
}

test("buildRequest uses GET when the first item is a url", () => {
  const request = buildRequest(["example.com"], baseOpts)

  expect(request.method).toBe("GET")
  expect(request.url).toBe("http://example.com/")
})

test("buildRequest normalizes explicit methods without mutating args", () => {
  const args = ["post", "example.com/api"]
  const request = buildRequest(args, baseOpts)

  expect(request.method).toBe("POST")
  expect(request.url).toBe("http://example.com/api")
  expect(args).toEqual(["post", "example.com/api"])
})

test("buildRequest supports HEAD requests", () => {
  const request = buildRequest(["head", "example.com/api"], baseOpts)

  expect(request.method).toBe("HEAD")
  expect(request.url).toBe("http://example.com/api")
})

test("buildRequest throws when a method has no url", () => {
  expect(() => buildRequest(["POST"], baseOpts)).toThrow("missing url: ")
})

test("buildRequest upgrades GET requests with a body to POST", () => {
  const request = buildRequest(["example.com", "a=1"], baseOpts)

  expect(request.method).toBe("POST")
})

test("buildRequest uses manual redirects by default", () => {
  const request = buildRequest(["example.com"], baseOpts)

  expect(request.redirect).toBe("manual")
})

test("buildRequest follows redirects when requested", () => {
  const request = buildRequest(["example.com"], {
    ...baseOpts,
    follow: true,
  })

  expect(request.redirect).toBe("follow")
})
