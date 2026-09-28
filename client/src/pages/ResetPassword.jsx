import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
      await api.post(`/auth/reset-password/${token}`, { password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or has expired')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="auth-page">
        <div className="card auth-card">
          <p className="eyebrow">Password reset</p>
          <h1>All set.</h1>
          <p className="muted">Your password has been updated. Redirecting to sign in…</p>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <p className="eyebrow">Password reset</p>
        <h1>Choose a new password.</h1>
        <div className="form-grid">
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Resetting…' : 'Reset password'}
          </button>
        </div>
        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </section>
  )
}
