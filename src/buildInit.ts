import type { ArgOpts } from "./args"
import { emptyObj } from "./utils/emptyObj"
import { parseRequestItem } from "./utils/parseRequestItem"
import { parseValue } from "./utils/parseValue"

export function buildInit(
  args: string[],
  url: URL,
  opts: ArgOpts,
): RequestInit {
  const headers = new Headers()
  const form = new FormData()
  const payload: Record<string, unknown> = {}

  for (const arg of args) {
    const item = parseRequestItem(arg)
    if (!item) continue

    if (item.type === "query") {
      url.searchParams.append(item.key, item.value)
    } else if (item.type === "header") {
      headers.append(item.key, item.value)
    } else if (item.parseJson) {
      payload[item.key] = parseValue(item.value)
    } else {
      form.append(item.key, item.value)
      payload[item.key] = item.value
    }
  }

  const body = opts.form
    ? form
    : emptyObj(payload)
      ? undefined
      : JSON.stringify(payload)

  if (opts.form) {
    headers.append("content-type", "application/x-www-form-urlencoded")
  } else if (opts.json) {
    headers.append("content-type", "application/json")
    headers.append("accept", "application/json")
  }

  return {
    headers,
    body,
  }
}
