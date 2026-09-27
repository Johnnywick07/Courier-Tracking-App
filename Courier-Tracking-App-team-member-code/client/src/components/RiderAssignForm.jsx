import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'

export default function RiderAssignForm({ deliveryId, onAssigned }) {
  const [riders, setRiders] = useState([])
  const [riderId, setRiderId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/riders')
      .then(({ data }) => setRiders(data))
      .catch(() => setError('Could not load riders'))
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (!riderId) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await api.patch(`/deliveries/${deliveryId}/assign`, { riderId })
      onAssigned?.(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not assign rider')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Rider
        <select value={riderId} onChange={(event) => setRiderId(event.target.value)} required>
          <option value="">Choose a rider</option>
          {riders.map((rider) => (
            <option key={rider._id} value={rider._id}>
              {rider.name} {rider.isAvailable ? '' : '(busy)'}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="button" type="submit" disabled={submitting || !riderId}>
        {submitting ? 'Assigning…' : 'Assign rider'}
      </button>
    </form>
  )
}
