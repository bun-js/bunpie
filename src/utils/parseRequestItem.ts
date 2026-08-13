import { splitByFirstOperator } from "./splitByFirstOperator"

export type RequestItem =
  | { type: "query"; key: string; value: string }
  | { type: "header"; key: string; value: string }
  | { type: "body"; key: string; value: string; parseJson: boolean }
  | { type: "file"; key: string; path: string }

const OPERATORS = [
  { token: "==", type: "query", parseJson: false },
  { token: ":=", type: "body", parseJson: true },
  { token: ":", type: "header", parseJson: false },
  { token: "=", type: "body", parseJson: false },
] as const

export function parseRequestItem(arg: string): RequestItem | null {
  const fileIndex = arg.indexOf("@")
  if (fileIndex > 0 && fileIndex < arg.length - 1) {
    const key = arg.slice(0, fileIndex)
    const path = arg.slice(fileIndex + 1)
    if (!key || !path || key.includes("=") || key.includes(":")) return null
    return { type: "file", key, path }
  }

  const match = splitByFirstOperator(arg, OPERATORS)
  if (!match) return null

  if (match.operator.type === "body") {
    return {
      type: "body",
      key: match.key,
      value: match.value,
      parseJson: match.operator.parseJson,
    }
  }

  return { type: match.operator.type, key: match.key, value: match.value }
}
