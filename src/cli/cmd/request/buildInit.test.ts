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
  const { url: requestUrl, init } = buildInit(
    ["a==1", "x:1", "name=bun", "file:=blob", "skip=="],
    url,
    jsonOpts,
  )

  expect(url.toString()).toBe("http://example.com/")
  expect(requestUrl.toString()).toBe("http://example.com/?a=1")
  expect(headersOf(init).get("x")).toBe("1")
  expect(headersOf(init).get("content-type")).toBe("application/json")
  expect(headersOf(init).get("accept")).toBe("application/json")
  expect(init.body).toBe(JSON.stringify({ name: "bun", file: "blob" }))
})

test("buildInit parses command-line body fields using json semantics", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(
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

test("buildInit preserves delimiter characters inside values", () => {
  const url = new URL("http://example.com/")
  const { url: requestUrl, init } = buildInit(
    [
      "q==a==b",
      "auth:Bearer x:y",
      "target=https://example.test/a:b?x=1&y=2",
      'raw:={"url":"https://example.test/a:b?x=1&y=2"}',
    ],
    url,
    jsonOpts,
  )

  expect(url.searchParams.get("q")).toBeNull()
  expect(requestUrl.searchParams.get("q")).toBe("a==b")
  expect(headersOf(init).get("auth")).toBe("Bearer x:y")
  expect(init.body).toBe(
    JSON.stringify({
      target: "https://example.test/a:b?x=1&y=2",
      raw: { url: "https://example.test/a:b?x=1&y=2" },
    }),
  )
})

test("buildInit serializes prototype-like body keys as data", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(['__proto__:={"polluted":true}'], url, jsonOpts)

  expect(init.body).toBe(JSON.stringify({ ["__proto__"]: { polluted: true } }))
  expect(({} as { polluted?: boolean }).polluted).toBeUndefined()
})

test("buildInit keeps invalid json values as strings for := fields", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(["value:=not-json"], url, jsonOpts)

  expect(init.body).toBe(JSON.stringify({ value: "not-json" }))
})

test("buildInit uses form encoding when requested", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(["name=bun"], url, {
    ...jsonOpts,
    form: true,
    json: false,
  })

  expect(headersOf(init).get("content-type")).toBe(
    "application/x-www-form-urlencoded",
  )
  expect(headersOf(init).get("accept")).toBeNull()
  expect(init.body).toBeInstanceOf(URLSearchParams)
  expect(init.body?.toString()).toBe("name=bun")
})

test("buildInit keeps json-style form fields as raw form values", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(["count:=42", "items:=[1,2]"], url, {
    ...jsonOpts,
    form: true,
    json: false,
  })

  expect(init.body?.toString()).toBe("count=42&items=%5B1%2C2%5D")
})

test("buildInit does not override user-provided default headers", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(
    ["content-type:text/plain", "accept:text/html", "name=bun"],
    url,
    jsonOpts,
  )

  expect(headersOf(init).get("content-type")).toBe("text/plain")
  expect(headersOf(init).get("accept")).toBe("text/html")
})

test("buildInit does not override user-provided form content type", () => {
  const url = new URL("http://example.com/")
  const { init } = buildInit(
    ["content-type:multipart/form-data", "name=bun"],
    url,
    {
      ...jsonOpts,
      form: true,
      json: false,
    },
  )

  expect(headersOf(init).get("content-type")).toBe("multipart/form-data")
})
