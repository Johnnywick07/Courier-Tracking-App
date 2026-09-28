import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TrackSearch() {
  const [trackingId, setTrackingId] = useState('')
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    if (trackingId.trim()) navigate(`/deliveries/${trackingId.trim()}`)
  }

  return (
    <section>
      <p className="eyebrow">Public tracking</p>
      <h1>Where is your parcel?</h1>
      <p className="muted">Enter a tracking number to see its latest movement.</p>
      <form className="search-row" onSubmit={submit}>
        <input
          value={trackingId}
          onChange={(event) => setTrackingId(event.target.value)}
          placeholder="e.g. TRK-2026-12345"
          aria-label="Tracking number"
          required
        />
        <button className="button" type="submit">
          Track parcel
        </button>
      </form>
    </section>
  )
}
