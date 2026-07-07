import { options } from "./options"

type HelpOptions = {
  ansi?: boolean
}

export function help({ ansi = false }: HelpOptions = {}) {
  const markdown = markdownHelp()
  return ansi ? Bun.markdown.ansi(markdown) : markdown
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
