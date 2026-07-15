import { useEffect, useState } from 'react'
import { getApiUrl, extractItems } from '../utils'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getApiUrl = () => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

    if (codespaceName) {
      return `https://${codespaceName}-8000.app.github.dev/api/users`
    }

    return `http://127.0.0.1:8000/api/users`
  }

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(getApiUrl('users'))

        if (!response.ok) {
          throw new Error(`Unable to load users (${response.status})`)
        }

        const payload = await response.json()
        const items = extractItems(payload, 'users')

        if (isMounted) {
          setUsers(items)
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

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">Users</p>
            <h2 className="h4 mb-0">Members overview</h2>
          </div>
        </div>

        {loading && <div className="text-muted">Loading users...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className="alert alert-light">No users are available yet.</div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="list-group">
            {users.map((user) => (
              <div key={user._id || user.id || user.email} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="h6 mb-1">{user.name || 'Unknown user'}</h3>
                  <p className="mb-1 text-muted">{user.email || 'No email provided'}</p>
                  <p className="mb-0 small text-muted">Goal: {user.fitnessGoal || 'General fitness'}</p>
                </div>
                <span className="badge text-bg-secondary">{user.streak || 0} day streak</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Users
