import { expect, test } from "bun:test"
import { helpCommand } from "./helpCommand"

test("helpCommand() returns rendered help and the requested exit code", () => {
  const result = helpCommand({ exitCode: 1, isTTY: false })

  expect(String(result.stdout)).toContain("bunpie")
  expect(result.exitCode).toBe(1)
})
