import { parseArgs } from "node:util"
import { options } from "./options"

export function args(args: string[]) {
  return parseArgs({
    args,
    allowNegative: true,
    allowPositionals: true,
    strict: true,
    options,
  })
}
