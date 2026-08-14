import { expect, test } from "bun:test"
import { renderResponse } from "./renderResponse"

test("renderResponse parses json bodies", async () => {
  const response = new Response(JSON.stringify({ ok: true }))

  expect(await renderResponse(response)).toEqual({ ok: true })
})

test("renderResponse returns text for non-json bodies", async () => {
  const response = new Response("plain text")

  expect(await renderResponse(response)).toBe("plain text")
})

test("renderResponse renders status and headers when requested", async () => {
  const response = new Response("plain text", {
    status: 418,
    headers: { "x-teapot": "true" },
  })

  expect(await renderResponse(response, { headers: true })).toBe(
    "HTTP 418\nx-teapot: true\n\nplain text",
  )
})
