import { options } from "./options"

export function help() {
  return process.stdout.isTTY
    ? Bun.markdown.ansi(markdownHelp())
    : markdownHelp()
}

function markdownHelp() {
  return [
    `# Usage

### bunpie [OPTIONS] [METHOD] URL [REQUEST_ITEM ...]

## Examples

## Options`,
    optionsHelp(),
    `##### For every --OPTION there is also a --no-OPTION.`,
  ].join("\n\n")
}

function optionsHelp() {
  return Object.entries(
    options as Record<
      string,
      { short?: string; param?: string; description?: string }
    >,
  )
    .map(
      ([cmd, opt]) =>
        `${opt.short ? `\`-${opt.short}\`, ` : ""}\`--${cmd}\` ${opt.param ? `[${opt.param}]()` : ""}\t${opt.description}`,
    )
    .join("\\\n")
}
