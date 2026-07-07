import { expect, test } from "bun:test"
import { splitByFirstOperator } from "./splitByFirstOperator"

const operators = [
  { token: "==", name: "query" },
  { token: ":=", name: "json" },
  { token: ":", name: "header" },
  { token: "=", name: "body" },
] as const

test("splitByFirstOperator splits on the earliest operator", () => {
  expect(
    splitByFirstOperator("url=https://example.test/a:b", operators),
  ).toEqual({
    operator: { token: "=", name: "body" },
    key: "url",
    value: "https://example.test/a:b",
  })
})

test("splitByFirstOperator uses declaration order for same-index operators", () => {
  expect(splitByFirstOperator("q==a=b", operators)).toEqual({
    operator: { token: "==", name: "query" },
    key: "q",
    value: "a=b",
  })
})

test("splitByFirstOperator ignores later operators farther to the right", () => {
  expect(splitByFirstOperator("header:value=still-value", operators)).toEqual({
    operator: { token: ":", name: "header" },
    key: "header",
    value: "value=still-value",
  })
})

test("splitByFirstOperator rejects missing operators, keys, and values", () => {
  expect(splitByFirstOperator("plain", operators)).toBeNull()
  expect(splitByFirstOperator("=value", operators)).toBeNull()
  expect(splitByFirstOperator("name=", operators)).toBeNull()
})
