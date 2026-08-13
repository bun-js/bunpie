import { emptyObj } from "../../../utils/emptyObj"
import { parseJsonOrText } from "../../../utils/parseJsonOrText"
import { parseRequestItem } from "../../../utils/parseRequestItem"
import { withDefaultHeader } from "../../../utils/withDefaultHeader"
import type { ArgOpts } from "../../args"

type RequestParts = {
  url: URL
  headers: Headers
  form: URLSearchParams
  multipart: FormData
  hasFile: boolean
  payload: Record<string, unknown>
}

type RequestBody = string | URLSearchParams | FormData | undefined

type BuildInitResult = {
  url: URL
  init: RequestInit
}

export function buildInit(
  args: string[],
  url: URL,
  opts: ArgOpts,
): BuildInitResult {
  const parts = collectRequestParts(args, url, opts)
  const headers = buildHeaders(parts.headers, opts, parts.hasFile)
  const body = buildBody(parts, opts)

  return {
    url: parts.url,
    init: {
      headers,
      body,
    },
  }
}

function collectRequestParts(
  args: string[],
  url: URL,
  opts: ArgOpts,
): RequestParts {
  const requestUrl = new URL(url)
  const headers = new Headers()
  const form = new URLSearchParams()
  const multipart = new FormData()
  const payload: Record<string, unknown> = Object.create(null)
  let hasFile = false
  const parts = { url: requestUrl, headers, form, multipart, hasFile, payload }

  for (const arg of args) {
    const item = parseRequestItem(arg)
    if (!item) continue

    if (item.type === "query") {
      requestUrl.searchParams.append(item.key, item.value)
    } else if (item.type === "header") {
      headers.append(item.key, item.value)
    } else if (opts.form && item.type === "file") {
      multipart.append(item.key, Bun.file(item.path))
      parts.hasFile = true
    } else if (opts.form) {
      form.append(item.key, item.value)
    } else if (item.type === "file") {
      continue
    } else if (item.parseJson) {
      payload[item.key] = parseJsonOrText(item.value)
    } else {
      payload[item.key] = item.value
    }
  }

  return parts
}

function buildBody(parts: RequestParts, opts: ArgOpts): RequestBody {
  const { form, multipart, payload, hasFile } = parts

  if (opts.form && hasFile) return multipart

  const body = opts.form
    ? form.toString()
      ? form
      : undefined
    : emptyObj(payload)
      ? undefined
      : JSON.stringify(payload)

  return body
}

function buildHeaders(
  headers: Headers,
  opts: ArgOpts,
  hasFile: boolean,
): Headers {
  if (opts.form && hasFile) {
    headers.delete("content-type")
    return headers
  }

  if (opts.form) {
    return withDefaultHeader(
      headers,
      "content-type",
      "application/x-www-form-urlencoded",
    )
  }

  if (opts.json) {
    const jsonHeaders = withDefaultHeader(
      headers,
      "content-type",
      "application/json",
    )
    return withDefaultHeader(jsonHeaders, "accept", "application/json")
  }

  return headers
}
