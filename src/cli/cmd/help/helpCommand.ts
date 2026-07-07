import type { CommandResult } from "../types"
import { renderHelp } from "./renderHelp"

type HelpCommandOptions = {
  exitCode: number
  isTTY: boolean
}

export function helpCommand({
  exitCode,
  isTTY,
}: HelpCommandOptions): CommandResult {
  return {
    stdout: renderHelp({ ansi: isTTY }),
    exitCode,
  }
}
