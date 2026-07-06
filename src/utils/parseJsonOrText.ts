export function parseJsonOrText(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
