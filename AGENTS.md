# AGENTS.md

## Project Overview

`bun-pie` is a small Bun-based HTTP client and CLI. The repository is intentionally minimal:

- one executable: `bunpie`
- no public library API beyond the CLI entrypoint
- TypeScript source in `src/`
- tests in `src/*.test.ts`

## Stack And Tooling

- Runtime: Bun `>=1.3.14`
- Formatting and linting: Biome
- Package metadata and CLI entrypoint live in `package.json`

## Commands

Check `mise.toml`

If you change test behavior or help output, run the relevant tests before finishing.

## Code Conventions

- Prefer small, focused modules.
- Keep the CLI behavior simple and predictable.
- Follow existing naming in the codebase, especially for helpers like `buildUrl`, `buildRequest`, and `help`.
- Preserve the current output contract unless the user explicitly asks for a behavior change.
- Use ASCII by default.
- Prefer Bun and standard library APIs already used in the repo.

## Testing Notes

- Help text is snapshot-tested in `src/help.test.ts`.
- If you intentionally change help output, update the snapshot in `src/__snapshots__/help.test.ts.snap`.
- Keep tests close to the code they cover.

## Editing Guidance

- Do not introduce extra abstractions unless they make the CLI easier to understand.
- Avoid broad refactors when a small local change is enough.
- Do not change package metadata, bin paths, or install instructions unless the task requires it.
- If you touch CLI argument parsing or request construction, verify the behavior for:
  - missing URL handling
  - default `GET` method behavior
  - method normalization
  - URL normalization to `http://`

## Repository Layout

- `bin/bunpie`: executable wrapper
- `src/index.ts`: package entry
- `src/cli.ts`: main CLI flow
- `src/args.ts`: argument parsing
- `src/buildRequest.ts`: request construction
- `src/buildUrl.ts`: URL normalization
- `src/help.ts`: help text rendering
- `src/options.ts`: CLI option definitions

## When In Doubt

- Prefer matching the current style over introducing new patterns.
- If a change affects user-visible output, inspect it carefully before considering the task done.
