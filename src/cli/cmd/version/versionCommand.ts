import { version } from "../../../../package.json"
import type { CommandResult } from "../types"

export function versionCommand(): CommandResult {
  return {
    stdout: `bunpie ${version}`,
    exitCode: 0,
  }
}
