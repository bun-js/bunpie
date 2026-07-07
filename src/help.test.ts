import { expect, test } from "bun:test"
import { help } from "./help"

test("help() matches snapshot", () => {
  expect(help()).toMatchSnapshot()
})

test("help() renders ansi output when requested", () => {
  expect(help({ ansi: true })).toContain("Usage")
})
