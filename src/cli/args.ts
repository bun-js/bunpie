import { parseArgs } from "node:util"
import { options } from "./options"

export type ArgOpts = {
  checkStatus?: boolean
  follow?: boolean
  form?: boolean
  headers?: boolean
  help?: boolean
  json?: boolean
  verbose?: boolean
  version?: boolean
}

type Args = {
  values: ArgOpts
  positionals: string[]
}

export function args(args: string[]): Args {
  return parseArgs({
    args,
    allowNegative: true,
    allowPositionals: true,
    strict: true,
    options,
  }) as Args
}
