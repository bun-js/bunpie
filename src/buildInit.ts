import type { ArgOpts } from "./args"
import { emptyObj } from "./utils/emptyObj"
import { parseRequestItem } from "./utils/parseRequestItem"
import { parseValue } from "./utils/parseValue"
import { withDefaultHeader } from "./utils/withDefaultHeader"

type BuildInitResult = {
  url: URL
  init: RequestInit
}

export function buildInit(
  args: string[],
  url: URL,
  opts: ArgOpts,
): BuildInitResult {
  const requestUrl = new URL(url)
  let headers = new Headers()
  const form = new URLSearchParams()
  const payload: Record<string, unknown> = Object.create(null)

  for (const arg of args) {
    const item = parseRequestItem(arg)
    if (!item) continue

    if (item.type === "query") {
      requestUrl.searchParams.append(item.key, item.value)
    } else if (item.type === "header") {
      headers.append(item.key, item.value)
    } else if (opts.form) {
      form.append(item.key, item.value)
    } else if (item.parseJson) {
      payload[item.key] = parseValue(item.value)
    } else {
      payload[item.key] = item.value
    }
  }

  const body = opts.form
    ? form.toString()
      ? form
      : undefined
    : emptyObj(payload)
      ? undefined
      : JSON.stringify(payload)

  if (opts.form) {
    headers = withDefaultHeader(
      headers,
      "content-type",
      "application/x-www-form-urlencoded",
    )
  } else if (opts.json) {
    headers = withDefaultHeader(headers, "content-type", "application/json")
    headers = withDefaultHeader(headers, "accept", "application/json")
  }

  return {
    url: requestUrl,
    init: {
      headers,
      body,
    },
  }
}
