import { expect, test } from "bun:test"
import { renderHelp } from "./renderHelp"
import { renderMarkdownHelp } from "./renderMarkdownHelp"

test("renderHelp() returns markdown by default", () => {
  expect(renderHelp()).toBe(renderMarkdownHelp())
})

test("renderHelp() renders ansi output when requested", () => {
  expect(renderHelp({ ansi: true })).toContain("Usage")
})
