import type { ParseArgsOptionDescriptor } from "node:util"
import optionsData from "./options.yaml"

type OptionDescriptor = Omit<
  ParseArgsOptionDescriptor,
  "default" | "multiple" | "type"
> & {
  type: "boolean"
  default?: boolean
  multiple?: false
  description?: string
  param?: string
}

type ArgsOpts = Record<string, OptionDescriptor>

export const options = optionsData as ArgsOpts
