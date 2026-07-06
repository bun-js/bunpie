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
    short: "V",
    description: "Show version and exit.",
  },
  json: {
    type: "boolean",
    short: "j",
    default: true,
    description:
      "(default) Data items from the command line are serialized as a JSON object. The Content-Type and Accept headers are set to application/json (if not specified).",
  },
  form: {
    type: "boolean",
    short: "f",
    default: false,
    description:
      "Data items from the command line are serialized as form fields. The Content-Type is set to application/x-www-form-urlencoded (if not specified). The presence of any file fields results in a multipart/form-data request.",
  },
  follow: {
    type: "boolean",
    short: "F",
    default: false,
    description: "Follow Location redirects.",
  },
} satisfies ArgsOpts
