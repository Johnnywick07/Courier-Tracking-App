import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [devResetUrl, setDevResetUrl] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setDevResetUrl('')
    setSubmitting(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data.message)
      // The backend currently returns the reset link directly since no email
      // service is configured yet. Remove this once real email sending is wired up.
      if (data.resetUrl) setDevResetUrl(data.resetUrl)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <p className="eyebrow">Account recovery</p>
        <h1>Forgot your password?</h1>
        <p className="muted">Enter your email and we'll generate a reset link.</p>
        <div className="form-grid">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}
          {devResetUrl && (
            <p className="muted dev-note">
              Dev mode (no email service configured yet):{' '}
              <Link to={devResetUrl.replace(window.location.origin, '')}>{devResetUrl}</Link>
            </p>
          )}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </div>
        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </section>
  )
}
