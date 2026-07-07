import { expect, test } from "bun:test"
import { parseRequestItem } from "./parseRequestItem"

test("parseRequestItem preserves separators inside values", () => {
  expect(parseRequestItem("q==a==b")).toEqual({
    type: "query",
    key: "q",
    value: "a==b",
  })
  expect(parseRequestItem("authorization:Bearer x:y")).toEqual({
    type: "header",
    key: "authorization",
    value: "Bearer x:y",
  })
  expect(parseRequestItem("url=https://example.test/a:b?x=1&y=2")).toEqual({
    type: "body",
    key: "url",
    value: "https://example.test/a:b?x=1&y=2",
    parseJson: false,
  })
})

test("parseRequestItem prefers multi-character operators at the same index", () => {
  expect(parseRequestItem('meta:={"ok":true}')).toEqual({
    type: "body",
    key: "meta",
    value: '{"ok":true}',
    parseJson: true,
  })
  expect(parseRequestItem("q==a=b")).toEqual({
    type: "query",
    key: "q",
    value: "a=b",
  })
})

test("parseRequestItem ignores items with missing keys or values", () => {
  expect(parseRequestItem("plain")).toBeNull()
  expect(parseRequestItem("=value")).toBeNull()
  expect(parseRequestItem("name=")).toBeNull()
  expect(parseRequestItem("header:")).toBeNull()
  expect(parseRequestItem("param==")).toBeNull()
})
