import { splitByFirstOperator } from "./splitByFirstOperator"

export type RequestItem =
  | { type: "query"; key: string; value: string }
  | { type: "header"; key: string; value: string }
  | { type: "body"; key: string; value: string; parseJson: boolean }

const OPERATORS = [
  { token: "==", type: "query", parseJson: false },
  { token: ":=", type: "body", parseJson: true },
  { token: ":", type: "header", parseJson: false },
  { token: "=", type: "body", parseJson: false },
] as const

export function parseRequestItem(arg: string): RequestItem | null {
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
