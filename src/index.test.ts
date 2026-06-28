import { expect, test } from "bun:test"
import { cli } from "./index"

test("index re-exports cli", () => {
  expect(cli).toBeDefined()
})
