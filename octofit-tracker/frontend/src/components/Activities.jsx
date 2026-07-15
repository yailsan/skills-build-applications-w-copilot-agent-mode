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

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadActivities = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(getApiUrl('activities'))

        if (!response.ok) {
          throw new Error(`Unable to load activities (${response.status})`)
        }

        const payload = await response.json()
        const items = extractItems(payload, 'activities')

        if (isMounted) {
          setActivities(items)
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

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">Activities</p>
            <h2 className="h4 mb-0">Recent fitness activity</h2>
          </div>
        </div>

        {loading && <div className="text-muted">Loading activities...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && activities.length === 0 && (
          <div className="alert alert-light">No activities have been recorded yet.</div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="list-group">
            {activities.map((activity) => (
              <div key={activity._id || activity.id || activity.date} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h3 className="h6 mb-1">{activity.type || 'Activity'}</h3>
                    <p className="mb-1 text-muted">{activity.user || 'Unknown user'}</p>
                    <p className="mb-0 small text-muted">
                      {activity.date || 'No date provided'} • {activity.durationMinutes || 0} mins
                    </p>
                  </div>
                  <span className="badge text-bg-primary">{activity.calories || 0} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Activities
