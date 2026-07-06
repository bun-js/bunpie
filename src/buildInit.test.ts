import { expect, test } from "bun:test"
import { buildInit } from "./buildInit"

const jsonOpts = {
  follow: false,
  form: false,
  json: true,
}

function headersOf(init: RequestInit) {
  return new Headers(init.headers)
}

test("buildInit routes query params, headers, and body fields", () => {
  const url = new URL("http://example.com/")
  const init = buildInit(
    ["a==1", "x:1", "name=bun", "file:=blob", "skip=="],
    url,
    jsonOpts,
  )

  expect(url.toString()).toBe("http://example.com/?a=1")
  expect(headersOf(init).get("x")).toBe("1")
  expect(headersOf(init).get("content-type")).toBe("application/json")
  expect(headersOf(init).get("accept")).toBe("application/json")
  expect(init.body).toBe(JSON.stringify({ name: "bun", file: "blob" }))
})

test("buildInit parses command-line body fields using json semantics", () => {
  const url = new URL("http://example.com/")
  const init = buildInit(
    [
      "name=bun",
      "count:=42",
      "active:=true",
      "disabled:=false",
      "ratio:=3.14",
      "empty:=null",
      "items:=[1,2,3]",
      'meta:={"version":1,"ok":false}',
    ],
    url,
    jsonOpts,
  )

  expect(url.toString()).toBe("http://example.com/")
  expect(init.body).toBe(
    JSON.stringify({
      name: "bun",
      count: 42,
      active: true,
      disabled: false,
      ratio: 3.14,
      empty: null,
      items: [1, 2, 3],
      meta: { version: 1, ok: false },
    }),
  )
})

test("buildInit keeps invalid json values as strings for := fields", () => {
  const url = new URL("http://example.com/")
  const init = buildInit(["value:=not-json"], url, jsonOpts)

  expect(init.body).toBe(JSON.stringify({ value: "not-json" }))
})

test("buildInit uses form encoding when requested", () => {
  const url = new URL("http://example.com/")
  const init = buildInit(["name=bun"], url, {
    ...jsonOpts,
    form: true,
    json: false,
  })

  expect(headersOf(init).get("content-type")).toBe(
    "application/x-www-form-urlencoded",
  )
  expect(headersOf(init).get("accept")).toBeNull()
  expect(init.body).toBeInstanceOf(FormData)
})
