export type CommandResult = {
  stdout?: unknown
  stderr?: string
  exitCode: number
}

export type Fetcher = typeof fetch

export type ResponseRenderer = (response: Response) => Promise<unknown>
