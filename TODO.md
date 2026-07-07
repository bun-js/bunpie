# TODO

Prioritized from common/easy HTTPie parity work to larger features that need more design.

Source: https://httpie.io/docs/cli

## 1. Method and URL parity

- [ ] Preserve explicit methods when request data is present. Today implicit `GET` with data can switch to `POST`, but explicit `GET example.com a=1` should stay `GET`.
- [ ] Accept custom HTTP method names instead of only the built-in method allowlist.
- [ ] Add localhost URL shortcuts: `:`, `:/path`, and `:3000/path`.
- [ ] Add an `https` executable or `--default-scheme` option for HTTPS-first usage.
- [ ] Consider `--path-as-is` for callers that need to preserve dot segments in request paths.

## 2. Output controls

- [ ] Render status line and response headers, not only the parsed body.
- [ ] Add `--headers`, `--body`, `--print`, and `--quiet` output modes.
- [ ] Add response metadata timing for `--meta` / extra verbose output.
- [ ] Add `--check-status` to exit non-zero for HTTP error responses.

## 3. Pretty and safe response rendering

- [ ] Pretty-print JSON responses with stable indentation.
- [ ] Add `--pretty=all|colors|format|none`.
- [ ] Suppress binary response bodies in terminal output.
- [ ] Respect response charset and add `--response-mime` / `--response-charset` overrides.

## 4. Request-item syntax parity

- [ ] Support file-based value separators: `Header:@file`, `field=@file`, `field:=@file`, and `param==@file`.
- [ ] Support escaping separator characters so literal `:`, `=`, `:=`, `==`, and `@` can appear in keys.
- [ ] Decide whether empty values like `Header:` and `field=` should be valid, then test the chosen behavior.
- [ ] Support multiple values for the same body field where HTTPie would preserve arrays or repeated form values.

## 5. Raw request bodies

- [ ] Add `--raw <DATA>` for verbatim request bodies.
- [ ] Read redirected stdin as the request body when no structured body fields are present.
- [ ] Add `@/path/to/file` body input.
- [ ] Add `--ignore-stdin` to opt out of implicit stdin reads.
- [ ] Reject combinations of raw input and structured request items with a clear error.

## 6. Authentication

- [ ] Add `--auth, -a` for Basic auth.
- [ ] Add `--auth-type, -A bearer` for bearer tokens.
- [ ] Support credentials in URLs while giving explicit `--auth` higher priority.
- [ ] Consider password prompting and empty-password handling.
- [ ] Later: Digest auth, `.netrc`, and auth plugin hooks.

## 7. Multipart forms and file upload

- [ ] Add `--multipart`.
- [ ] Add `field@file` and `field@file;type=mime`.
- [ ] Infer file content type from filename.
- [ ] Stream file uploads instead of buffering large files.

## 8. Redirect controls

- [ ] Add `--all` to show intermediate redirect responses.
- [ ] Add `--max-redirects <N>`.
- [ ] Verify redirect method/body behavior for `307` and `308`.

## 9. Download mode

- [ ] Add `--download, -d` with response headers on stderr.
- [ ] Add `--output, -o` filename selection.
- [ ] Infer filenames from `Content-Disposition`, URL, and content type.
- [ ] Avoid accidental overwrite unless explicitly requested.
- [ ] Add `--continue, -c` for resumable downloads.

## 10. Configuration defaults

- [ ] Load default options from a config file.
- [ ] Define config location and precedence between config, environment, and CLI flags.
- [ ] Add tests that config defaults do not surprise one-off CLI calls.

## 11. Sessions and cookies

- [ ] Add named and path-based `--session` files.
- [ ] Persist custom headers, auth, and cookies between requests.
- [ ] Add `--session-read-only`.
- [ ] Document that session files can contain credentials in plain text.

## 12. Proxies and TLS options

- [ ] Add `--proxy protocol:url` parsing.
- [ ] Respect `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, and `NO_PROXY` where Bun supports it.
- [ ] Add `--verify=no` and custom CA bundle support if Bun exposes the needed TLS controls.
- [ ] Add client certificate options if Bun exposes the needed TLS controls.

## 13. Streaming, compression, and transfer encoding

- [ ] Add `--stream` for unbuffered response output.
- [ ] Automatically stream `text/event-stream`.
- [ ] Add `--chunked` request transfer encoding if Bun exposes it.
- [ ] Add `--compress, -x` for compressed request bodies.

## 14. Nested JSON construction

- [ ] Add object path syntax such as `user[name]=Ada`.
- [ ] Add array append/index syntax such as `tags[]=cli` and `items[1]=x`.
- [ ] Merge raw JSON fields into nested structures.
- [ ] Define conflicts, sparse arrays, repeated paths, and invalid path errors before implementation.

## 15. Plugin architecture

- [ ] Define extension points for auth, transports, and output formatters.
- [ ] Decide whether plugins are local Bun modules, npm packages, or config-registered scripts.
- [ ] Keep plugin loading opt-in and explicit to avoid surprising code execution.
