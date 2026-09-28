import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

const emptyForm = {
  sender: { name: '', phone: '', address: '' },
  receiver: { name: '', phone: '', address: '' },
  parcel: { description: '', weightKg: '' },
}

export default function CreateDelivery() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const update = (section, field, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await api.post('/deliveries', {
        ...form,
        parcel: { ...form.parcel, weightKg: Number(form.parcel.weightKg) || 0 },
      })
      navigate(`/deliveries/${data.trackingId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create delivery')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="form-card">
      <p className="eyebrow">New shipment</p>
      <h1>Create a delivery</h1>
      <p className="muted">Add sender, receiver, and parcel details.</p>

      <form className="card form-grid" onSubmit={submit}>
        <label>
          Sender name
          <input
            value={form.sender.name}
            onChange={(event) => update('sender', 'name', event.target.value)}
            required
          />
        </label>
        <label>
          Sender phone
          <input
            value={form.sender.phone}
            onChange={(event) => update('sender', 'phone', event.target.value)}
            required
          />
        </label>
        <label>
          Sender address
          <input
            value={form.sender.address}
            onChange={(event) => update('sender', 'address', event.target.value)}
            required
          />
        </label>

        <label>
          Receiver name
          <input
            value={form.receiver.name}
            onChange={(event) => update('receiver', 'name', event.target.value)}
            required
          />
        </label>
        <label>
          Receiver phone
          <input
            value={form.receiver.phone}
            onChange={(event) => update('receiver', 'phone', event.target.value)}
            required
          />
        </label>
        <label>
          Receiver address
          <input
            value={form.receiver.address}
            onChange={(event) => update('receiver', 'address', event.target.value)}
            required
          />
        </label>

        <label>
          Parcel description
          <input
            value={form.parcel.description}
            onChange={(event) => update('parcel', 'description', event.target.value)}
            required
          />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            step="0.1"
            value={form.parcel.weightKg}
            onChange={(event) => update('parcel', 'weightKg', event.target.value)}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create delivery'}
          </button>
          <button className="button secondary" type="button" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
