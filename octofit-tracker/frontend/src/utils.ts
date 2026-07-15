export const extractItems = (payload: unknown, resource: string): unknown[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const candidates = [resource, 'results', 'items', 'data', 'docs', 'records', 'entries']

  for (const candidate of candidates) {
    const value = (payload as Record<string, unknown>)[candidate]
    if (Array.isArray(value)) {
      return value
    }
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}
