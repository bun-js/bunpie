import { renderMarkdownHelp } from "./renderMarkdownHelp"

type RenderHelpOptions = {
  ansi?: boolean
}

export function renderHelp({ ansi = false }: RenderHelpOptions = {}): string {
  const markdown = renderMarkdownHelp()
  return ansi ? Bun.markdown.ansi(markdown) : markdown
}
