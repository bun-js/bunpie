import { expect, test } from "bun:test"
import { version } from "../../../../package.json"
import { versionCommand } from "./versionCommand"

test("versionCommand() returns the package version", () => {
  expect(versionCommand()).toEqual({
    stdout: `bunpie ${version}`,
    exitCode: 0,
  })
})
