# bun-pie

[![npm version](https://img.shields.io/npm/v/bun-pie.svg)](https://www.npmjs.com/package/bun-pie)
[![license](https://img.shields.io/npm/l/bun-pie.svg?)](./LICENSE)
[![Bun](https://img.shields.io/badge/Bun-%3E%3D1.3.14-f472b6)](https://bun.sh)

`bunpie` is a flavored [httpie](https://httpie.io/) on Bun.

Note: the npm package is named `bun-pie` because `bunpie` is not available on npm. The installed executable is still `bunpie`.

## Install

```bash
bun install -g bun-pie
```

## Requirements

- Bun `>=1.3.14`
- Node.js not supported

## Usage

```bash
bunpie [OPTIONS] [METHOD] URL [REQUEST_ITEM ...]
```

Examples:

```bash
bunpie example.com
bunpie GET https://example.com
bunpie POST https://example.com/api
bunpie example.com foo:bar
bunpie example.com foo==bar
bunpie example.com name=bun count:=42
```

If you omit the method, `bunpie` defaults to `GET`.

Request items follow httpie-style parsing:

- `foo:bar` becomes a header
- `foo==bar` becomes a URL query parameter
- `foo=bar` becomes a body field serialized into JSON by default
- `foo:=42` becomes a JSON-parsed body field, so numbers, booleans, arrays, objects, and `null` are preserved

When JSON mode is active, body fields are serialized as JSON and the `Content-Type` and `Accept` headers are set to `application/json` unless you already provided them.
When form mode is active, body fields are collected as form data and `Content-Type` is set to `application/x-www-form-urlencoded` unless you already provided it.

## Development

Uses `mise`. See `mise.toml` for available tasks.

## Package Contents

This package is intentionally minimal and ships only what is needed to run the binary:

- `bin/bunpie`
- `src/`
- `src/utils/`
- `README.md`
- `LICENSE`

## License

MIT. See [LICENSE](./LICENSE).

## Similar or related Projects

- [httpie](https://httpie.io/) - The original one
- [xh](https://github.com/ducaale/xh) - httpie-like HTTP client written in Rust
- [httpie-go](https://github.com/nojima/httpie-go) - httpie-like HTTP client written in Go
- [curlie](https://github.com/rs/curlie) - frontend to cURL that adds the ease of use of httpie
- [curl2httpie](https://github.com/dcb9/curl2httpie) - convert command arguments between cURL and HTTPie
