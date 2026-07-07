import { expect, test } from "bun:test"
import { renderOptionsHelp } from "./renderOptionsHelp"

test("renderOptionsHelp() renders option rows", () => {
  const output = renderOptionsHelp()

  expect(output).toContain("`-h`, `--help`")
  expect(output).toContain("`-f`, `--form`")
  expect(output).toContain("Show this help message and exit.")
})
