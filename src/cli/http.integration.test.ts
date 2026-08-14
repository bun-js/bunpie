import { afterEach, expect, test } from "bun:test"
import { renderResponse } from "./cmd/request/renderResponse"
import { run } from "./run"

const servers: Bun.Server[] = []

afterEach(() => {
  for (const server of servers.splice(0)) server.stop(true)
})

function startServer() {
  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url)

      if (url.pathname === "/json" && request.method === "POST") {
        return Response.json({
          method: request.method,
          query: url.searchParams.get("query"),
          header: request.headers.get("x-test-header"),
          body: await request.json(),
        })
      }

      if (url.pathname === "/form" && request.method === "POST") {
        return request.text().then((body) =>
          Response.json({
            contentType: request.headers.get("content-type"),
            body,
          }),
        )
      }

      if (url.pathname === "/error") {
        return Response.json({ error: "teapot" }, { status: 418 })
      }

      return new Response("not found", { status: 404 })
    },
  })
  servers.push(server)
  return server
}

function runRequest(argv: string[]) {
  return run(argv, {
    fetch,
    isTTY: false,
    renderResponse,
  })
}

test("run sends JSON requests and renders the response from a local HTTP server", async () => {
  const server = startServer()

  const result = await runRequest([
    "POST",
    `${server.url}json`,
    "query==bun",
    "x-test-header:integration",
    "name=bun",
  ])

  expect(result).toEqual({
    stdout: {
      method: "POST",
      query: "bun",
      header: "integration",
      body: { name: "bun" },
    },
    exitCode: 0,
  })
})

test("run sends form requests and preserves non-2xx response bodies", async () => {
  const server = startServer()

  const formResult = await runRequest(
    ["--form", `${server.url}form`, "name=bun", "mode:=fast"],
  )

  expect(formResult).toEqual({
    stdout: {
      contentType: "application/x-www-form-urlencoded",
      body: "name=bun&mode=fast",
    },
    exitCode: 0,
  })

  const errorResult = await runRequest([`${server.url}error`])

  expect(errorResult).toEqual({
    stdout: { error: "teapot" },
    exitCode: 0,
  })
})
