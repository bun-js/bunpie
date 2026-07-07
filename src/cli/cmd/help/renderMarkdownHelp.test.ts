import { expect, test } from "bun:test"
import { renderMarkdownHelp } from "./renderMarkdownHelp"

test("renderMarkdownHelp() matches snapshot", () => {
  expect(renderMarkdownHelp()).toMatchSnapshot()
})
