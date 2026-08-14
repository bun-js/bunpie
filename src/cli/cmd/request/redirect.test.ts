import { expect, test } from "bun:test"
import { buildRequest } from "./buildRequest"

for (const status of [307, 308]) {
  test(`following a ${status} redirect preserves the POST method and JSON body`, async () => {
    const server = Bun.serve({
      port: 0,
      async fetch(request) {
        if (new URL(request.url).pathname === "/redirect") {
          return Response.redirect(`${server.url}target`, status)
        }

        return Response.json({
          body: await request.text(),
          contentType: request.headers.get("content-type"),
          method: request.method,
        })
      },
    })

    try {
      const request = buildRequest(
        ["post", `${server.url}redirect`, "message=hello", "count:=2"],
        { follow: true, form: false, json: true },
      )
      const response = await fetch(request)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({
        body: JSON.stringify({ message: "hello", count: 2 }),
        contentType: "application/json",
        method: "POST",
      })
    } finally {
      server.stop()
    }
  })
}
