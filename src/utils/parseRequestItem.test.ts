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

test("parseRequestItem ignores items with missing operators or keys", () => {
  expect(parseRequestItem("plain")).toBeNull()
  expect(parseRequestItem("=value")).toBeNull()
})

test("parseRequestItem preserves empty values", () => {
  expect(parseRequestItem("name=")).toEqual({
    type: "body",
    key: "name",
    value: "",
    parseJson: false,
  })
  expect(parseRequestItem("header:")).toEqual({
    type: "header",
    key: "header",
    value: "",
  })
  expect(parseRequestItem("param==")).toEqual({
    type: "query",
    key: "param",
    value: "",
  })
  expect(parseRequestItem("value:=")).toEqual({
    type: "body",
    key: "value",
    value: "",
    parseJson: true,
  })
})
