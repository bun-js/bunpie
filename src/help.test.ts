import { afterEach, expect, test } from "bun:test"
import { help } from "./help"

const originalIsTTY = process.stdout.isTTY

afterEach(() => {
  Object.defineProperty(process.stdout, "isTTY", {
    configurable: true,
    value: originalIsTTY,
  })
})

test("help() matches snapshot", () => {
  Object.defineProperty(process.stdout, "isTTY", {
    configurable: true,
    value: false,
  })

  expect(help()).toMatchSnapshot()
})
