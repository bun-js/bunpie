import { renderOptionsHelp } from "./renderOptionsHelp"

export function renderMarkdownHelp(): string {
  return [
    `# Usage

### bunpie [OPTIONS] [METHOD] URL [REQUEST_ITEM ...]

## Examples

## Options`,
    renderOptionsHelp(),
    `##### For every --OPTION there is also a --no-OPTION.`,
  ].join("\n\n")
}
