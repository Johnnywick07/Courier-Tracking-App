import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setSubmitting(true)
    try {
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <p className="eyebrow">Join Parcel / Pulse</p>
        <h1>Create your account.</h1>
        <p className="muted">Set up access to create, assign, and track deliveries.</p>
        <div className="form-grid">
          <label>
            Full name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Account type
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="customer">Customer</option>
              <option value="rider">Rider</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </div>
        <div className="auth-links">
          <span className="muted">Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </form>
    </section>
  )
}
