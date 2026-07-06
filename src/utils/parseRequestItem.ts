export type RequestItem =
  | { type: "query"; key: string; value: string }
  | { type: "header"; key: string; value: string }
  | { type: "body"; key: string; value: string; parseJson: boolean }

export function parseRequestItem(arg: string): RequestItem | null {
  if (arg.includes("==")) {
    const [key, value] = arg.split("==", 2)
    if (key && value) return { type: "query", key, value }
  } else if (arg.includes(":=")) {
    const [key, value] = arg.split(":=", 2)
    if (key && value) return { type: "body", key, value, parseJson: true }
  } else if (arg.includes(":")) {
    const [key, value] = arg.split(":", 2)
    if (key && value) return { type: "header", key, value }
  } else if (arg.includes("=")) {
    const [key, value] = arg.split("=", 2)
    if (key && value) return { type: "body", key, value, parseJson: false }
  }

  return null
}
