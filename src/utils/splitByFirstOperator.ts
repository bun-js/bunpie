type Operator = {
  token: string
}

type SplitResult<T extends Operator> = {
  operator: T
  key: string
  value: string
}

export function splitByFirstOperator<T extends Operator>(
  input: string,
  operators: readonly T[],
): SplitResult<T> | null {
  let match: { operator: T; index: number; order: number } | null = null

  for (const [order, operator] of operators.entries()) {
    const index = input.indexOf(operator.token)
    if (index < 0) continue

    if (
      !match ||
      index < match.index ||
      (index === match.index && order < match.order)
    ) {
      match = { operator, index, order }
    }
  }

  if (!match) return null

  const key = input.slice(0, match.index)
  const value = input.slice(match.index + match.operator.token.length)
  if (!key || !value) return null

  return { operator: match.operator, key, value }
}
