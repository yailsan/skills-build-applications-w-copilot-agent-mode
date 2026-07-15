// Provide a minimal declaration for ImportMeta.env to satisfy TypeScript
declare global {
  interface ImportMeta {
    readonly env: {
      VITE_CODESPACE_NAME?: string
      [key: string]: unknown
    }
  }
}

export const getApiUrl = (resource: string): string => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${resource}/`
  }

  return `http://127.0.0.1:8000/api/${resource}/`
}

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
