import { useEffect, useState } from 'react'

const getApiUrl = (resource) => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${resource}/`
  }

  return `http://127.0.0.1:8000/api/${resource}/`
}

const extractItems = (payload, resource) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const candidates = [resource, 'results', 'items', 'data', 'docs', 'records', 'entries']

  for (const candidate of candidates) {
    const value = payload[candidate]
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

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadTeams = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(getApiUrl('teams'))

        if (!response.ok) {
          throw new Error(`Unable to load teams (${response.status})`)
        }

        const payload = await response.json()
        const items = extractItems(payload, 'teams')

        if (isMounted) {
          setTeams(items)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">Teams</p>
            <h2 className="h4 mb-0">Community squads</h2>
          </div>
        </div>

        {loading && <div className="text-muted">Loading teams...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && teams.length === 0 && (
          <div className="alert alert-light">No teams are available yet.</div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {teams.map((team) => (
              <div key={team._id || team.id || team.name} className="col">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h6 mb-2">{team.name || 'Untitled team'}</h3>
                    <p className="text-muted mb-2">{team.focus || 'General fitness'}</p>
                    <p className="mb-0 small text-muted">{team.members || 0} members</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Teams
