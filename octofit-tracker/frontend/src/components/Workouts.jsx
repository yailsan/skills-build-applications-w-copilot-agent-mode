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

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadWorkouts = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(getApiUrl('workouts'))

        if (!response.ok) {
          throw new Error(`Unable to load workouts (${response.status})`)
        }

        const payload = await response.json()
        const items = extractItems(payload, 'workouts')

        if (isMounted) {
          setWorkouts(items)
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

    loadWorkouts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">Workouts</p>
            <h2 className="h4 mb-0">Suggested routines</h2>
          </div>
        </div>

        {loading && <div className="text-muted">Loading workouts...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && workouts.length === 0 && (
          <div className="alert alert-light">No workouts are available yet.</div>
        )}

        {!loading && !error && workouts.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {workouts.map((workout) => (
              <div key={workout._id || workout.id || workout.title} className="col">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h6 mb-2">{workout.title || 'Untitled workout'}</h3>
                    <p className="text-muted mb-2">{workout.focus || 'General conditioning'}</p>
                    <p className="mb-0 small text-muted">
                      {workout.durationMinutes || 0} mins • {workout.level || 'Intermediate'}
                    </p>
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

export default Workouts
