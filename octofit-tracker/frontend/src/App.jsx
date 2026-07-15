import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`
  }

  return 'http://127.0.0.1:8000'
}

function HomeView() {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <section className="card shadow-sm border-0 h-100">
          <div className="card-body p-4 p-lg-5">
            <p className="text-uppercase text-primary fw-semibold mb-3">OctoFit Tracker</p>
            <h1 className="display-6 fw-bold mb-3">A polished React 19 presentation tier for your multi-tier app</h1>
            <p className="lead text-muted mb-4">
              Explore users, teams, activity history, leaderboard performance, and tailored workouts from the shared Express API.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a className="btn btn-primary" href={`${getApiBaseUrl()}/api/health`}>
                Check API health
              </a>
              <span className="btn btn-outline-secondary">Frontend on 5173</span>
            </div>
          </div>
        </section>
      </div>
      <div className="col-lg-4">
        <section className="card shadow-sm border-0 h-100">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Environment configuration</h2>
            <p className="text-muted mb-3">
              Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> to use the public GitHub Codespaces API URL.
            </p>
            <p className="small text-muted mb-0">
              If it is not set, the app falls back to the local development API at http://127.0.0.1:8000.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="border-bottom bg-white shadow-sm">
        <div className="container py-3 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">OctoFit Tracker</p>
            <h1 className="h4 mb-0">Presentation tier</h1>
          </div>
          <nav className="nav nav-pills flex-wrap">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
