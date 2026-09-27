import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import DeliveryCard from '../components/DeliveryCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .get('/deliveries')
      .then(({ data }) => {
        if (!cancelled) setDeliveries(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load deliveries')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const active = deliveries.filter((d) => d.status !== 'delivered' && d.status !== 'failed').length
    const outForDelivery = deliveries.filter((d) => d.status === 'out_for_delivery').length
    const today = new Date().toDateString()
    const deliveredToday = deliveries.filter(
      (d) => d.status === 'delivered' && new Date(d.updatedAt).toDateString() === today
    ).length
    return { active, outForDelivery, deliveredToday }
  }, [deliveries])

  return (
    <>
      <div className="header-row">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Good morning, {user?.name || 'operator'}.</h1>
          <p className="muted">A clear view of everything moving through your network.</p>
        </div>
        {user?.role === 'admin' && (
          <Link className="button" to="/deliveries/new">
            Create delivery
          </Link>
        )}
      </div>

      <div className="grid stats-grid">
        <div className="card">
          <span className="muted">Active deliveries</span>
          <strong className="stat-value">{stats.active}</strong>
        </div>
        <div className="card">
          <span className="muted">Out for delivery</span>
          <strong className="stat-value">{stats.outForDelivery}</strong>
        </div>
        <div className="card">
          <span className="muted">Delivered today</span>
          <strong className="stat-value">{stats.deliveredToday}</strong>
        </div>
      </div>

      <div className="header-row">
        <div>
          <p className="eyebrow">Latest movement</p>
          <h2>{user?.role === 'rider' ? 'My deliveries' : 'Delivery queue'}</h2>
        </div>
        <Link className="muted" to="/track">
          Track by number
        </Link>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : deliveries.length === 0 ? (
        <p className="muted">No deliveries yet.</p>
      ) : (
        <div className="grid delivery-grid">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery._id} delivery={delivery} />
          ))}
        </div>
      )}
    </>
  )
}
