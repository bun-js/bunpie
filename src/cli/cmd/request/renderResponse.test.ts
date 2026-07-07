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
