import { renderOptionsHelp } from "./renderOptionsHelp"

export function renderMarkdownHelp(): string {
  return [
    `# Usage

### bunpie [OPTIONS] [METHOD] URL [REQUEST_ITEM ...]

## Examples

```
bunpie example.com
bunpie GET https://example.com
bunpie POST https://example.com/api
bunpie example.com foo:bar
bunpie example.com foo==bar
bunpie example.com name=bun count:=42
```

## Current capabilities

The current CLI sends one HTTP request and prints the parsed response body. It supports URL normalization, explicit HTTP methods from the supported method list, HTTPie-style headers/query/body request items, JSON or form fields, `--follow`, `--help`, `--version`, and `--verbose`.

Response status lines and headers, authentication, file uploads, downloads, sessions, and other HTTPie parity features are not implemented yet. See `TODO.md` for planned work; that list is not a list of currently available commands or options.

## Options`,
    renderOptionsHelp(),
    `##### For every --OPTION there is also a --no-OPTION.`,
  ].join("\\n\\n")
}
