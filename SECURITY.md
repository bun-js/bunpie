# Security requirements for future extensibility

This document defines the security bar for adding extensibility to bunpie. It
applies before merging any feature that introduces authentication, sessions,
configuration files, file inputs, plugins, or execution of user-provided
commands or code.

## Current security boundary

bunpie currently has no authentication or session store, configuration-file
loader, file-input feature, plugin system, or execution facility. Its request
data comes from command-line arguments and is sent with the request constructed
by the CLI. A future feature must not silently expand that boundary.

## General requirements

- Document the threat model, trust boundaries, data flows, and failure modes
  before implementation.
- Keep new capabilities disabled unless the user explicitly opts in. A
  capability must not become active merely because a file, environment
  variable, or plugin happens to exist.
- Fail closed: invalid, ambiguous, unreadable, or unexpected input must stop
  the operation rather than trigger a fallback with broader access.
- Do not log secrets, tokens, cookies, session identifiers, request bodies, or
  sensitive file contents. Redaction must happen before data reaches verbose
  output, errors, traces, or diagnostics.
- Avoid adding dependencies that execute installation hooks or load remote code
  without a documented review and an explicit user decision.
- Add tests for authorization boundaries, path handling, precedence, redaction,
  and opt-in behavior. Include negative tests for attempts to bypass each
  boundary.

## Secrets and credential storage

- Never commit credentials, tokens, private keys, cookies, or session data to
  the repository, generated artifacts, or default configuration files.
- Do not expose secrets in command-line arguments when a safer input is
  available: command-line arguments can be recorded by shell history, process
  listings, and operating-system diagnostics.
- Prefer environment variables or an operating-system credential store for
  non-interactive use. If a file is unavoidable, use a user-owned path with
  restrictive permissions, reject group/world-writable files, and explain the
  storage location and lifecycle.
- Keep credentials out of URLs, query strings, rendered requests, and verbose
  output. Redact authorization headers and cookie values by default.
- Never send credentials to a different origin because of redirects or config
  changes without an explicit, documented policy.
- Do not persist credentials or refresh tokens unless persistence is an
  explicit feature with clear save, use, revoke, and delete behavior.

## Authentication and sessions

- Authentication must be explicit per request or through a clearly visible
  opt-in session/profile selection.
- Session files must be stored with restrictive permissions, bound to the
  intended user, and protected against symlink and path traversal attacks.
- Expired, malformed, or unverifiable sessions must be rejected and removed
  only with user-visible behavior; never silently replace them with a weaker
  authentication mode.
- Do not share cookies, bearer tokens, client certificates, or other
  origin-bound credentials across origins by default.

## Configuration files and precedence

- Configuration loading must be explicitly documented and discoverable. A
  file in the current directory must not be trusted merely because it exists.
- Define and test one deterministic precedence order. The default order is:
  command-line options > explicitly selected config file > environment
  variables > user config > built-in defaults.
- A higher-precedence source may override a lower-precedence source only for
  fields it actually defines; do not merge security-sensitive fields in a way
  that is surprising or ambiguous.
- Do not allow configuration to silently enable plugins, code execution,
  credential persistence, or access outside the working directory.
- Reject unknown security-sensitive keys, duplicate keys with unclear meaning,
  unsafe permissions, and malformed values. Report the source of an effective
  value without printing its secret.
- Config discovery must not follow symlinks or parent-directory files into an
  unexpected trust boundary without explicit user selection.

## File inputs and filesystem access

- File access must be explicitly requested by the user and limited to the
  selected path(s). Reading a config file must not implicitly grant access to
  arbitrary files.
- Resolve and validate paths before opening them. Prevent traversal, unsafe
  symlink resolution, device files, and paths outside the permitted root.
- Define behavior for non-regular files, missing files, races, permissions, and
  files that change while they are being read. Fail closed when validation and
  use disagree.
- Do not upload a file, its metadata, or its contents to an origin unless the
  user explicitly selected that transfer and the destination is visible.
- Do not include file contents in logs or error messages. Bound size, count,
  and memory use to reduce denial-of-service risk.

## Plugins and code execution

- Plugins and execution features must be disabled by default and require a
  visible, per-use opt-in. Installing or discovering a plugin must not execute
  it.
- Do not load code from URLs, writable directories, the current directory, or
  untrusted config without explicit selection and a documented trust model.
- Pin plugin identity and version where possible, verify integrity and origin,
  and make the permissions requested by each plugin visible before approval.
- Run untrusted or third-party code with the smallest practical permissions:
  no network, filesystem, environment, subprocess, or credential access unless
  separately granted.
- Keep plugin errors and output isolated from secrets and from the host
  process. A plugin must not be able to change security settings silently.
- Every execution path must have a clear confirmation, an abort mechanism, and
  tests proving that execution does not occur without opt-in.

## Review checklist

Before merging an extensibility feature, its pull request must answer:

1. What new data, code, origins, files, and permissions can it access?
2. What is the exact opt-in switch, and what happens when it is absent?
3. What is the configuration precedence, and is it covered by tests?
4. How are secrets redacted, stored, rotated, and deleted?
5. How are path traversal, symlinks, redirects, malformed input, and races
   handled?
6. What negative tests demonstrate that unauthorized behavior is rejected?

If any answer is unclear, the feature is not ready to merge.
