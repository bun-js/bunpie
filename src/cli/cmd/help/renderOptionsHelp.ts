import { options } from "../../options"

export function renderOptionsHelp(): string {
  return Object.entries(
    options as Record<
      string,
      { short?: string; param?: string; description?: string }
    >,
  )
    .map(
      ([cmd, opt]): string =>
        `${opt.short ? `\`-${opt.short}\`, ` : ""}\`--${cmd}\` ${opt.param ? `[${opt.param}]()` : ""}\t${opt.description}`,
    )
    .join("\\\n")
}
