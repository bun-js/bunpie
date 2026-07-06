import { expect, test } from "bun:test"
import { options } from "./options"

test("options matches snapshot", () => {
  expect(options).toMatchSnapshot()
})
