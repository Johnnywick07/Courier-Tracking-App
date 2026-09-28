import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navbar component for displaying navigation links
export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        Parcel / Pulse
      </Link>
      <div className="nav-links">
        <Link to="/track">Track a parcel</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'admin' && <Link to="/deliveries/new">New delivery</Link>}
            {(user.role === 'admin' || user.role === 'rider') && (
              <Link to="/rider">Rider panel</Link>
            )}
            <span className="nav-user">{user.name || user.email || 'Operator'}</span>
            <button className="button ghost" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link className="button ghost" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
