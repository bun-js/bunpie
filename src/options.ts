import type { ParseArgsOptionDescriptor } from "node:util"

type OptionDescriptor = ParseArgsOptionDescriptor & {
  description?: string
  param?: string
}

type ArgsOpts = Record<string, OptionDescriptor>

export const options = {
  help: {
    short: "h",
    type: "boolean",
    description: "Show this help message and exit.",
  },
  verbose: {
    type: "boolean",
    short: "v",
    description: "Verbose output.",
  },
  version: {
    type: "boolean",
    description: "Show version and exit.",
  },
} satisfies ArgsOpts
