import { useEffect, useState } from 'react'
import { getApiUrl, extractItems } from '../utils'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadLeaderboard = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(getApiUrl('leaderboard'))

        if (!response.ok) {
          throw new Error(`Unable to load leaderboard (${response.status})`)
        }

        const payload = await response.json()
        const items = extractItems(payload, 'leaderboard')

        if (isMounted) {
          setEntries(items)
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

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">Leaderboard</p>
            <h2 className="h4 mb-0">Top performers</h2>
          </div>
        </div>

        {loading && <div className="text-muted">Loading leaderboard...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && entries.length === 0 && (
          <div className="alert alert-light">No leaderboard entries are available yet.</div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="list-group">
            {entries.map((entry) => (
              <div key={entry._id || entry.id || entry.rank} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="h6 mb-1">#{entry.rank || '—'} {entry.user || 'Unknown user'}</h3>
                  <p className="mb-0 text-muted">{entry.team || 'No team'}</p>
                </div>
                <span className="badge text-bg-success">{entry.points || 0} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
