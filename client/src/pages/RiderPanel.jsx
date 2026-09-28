import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import DeliveryCard from '../components/DeliveryCard'
import { useAuth } from '../context/AuthContext'

export default function RiderPanel() {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState([])
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState('')

  useEffect(() => {
    if (user?.role === 'rider') {
      api
        .get('/deliveries')
        .then(({ data }) => setDeliveries(data))
        .finally(() => setLoading(false))
    } else if (user?.role === 'admin') {
      api
        .get('/riders')
        .then(({ data }) => setRiders(data))
        .finally(() => setLoading(false))
    }
  }, [user])

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by this browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.patch(`/riders/${user._id}/location`, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
          setLocationStatus('Location updated')
        } catch {
          setLocationStatus('Could not update location')
        }
      },
      () => setLocationStatus('Unable to get your location')
    )
  }

  if (user?.role === 'rider') {
    return (
      <>
        <p className="eyebrow">Dispatch desk</p>
        <h1>Rider panel</h1>
        <p className="muted">Your assigned deliveries and live location.</p>

        <div className="card form-card" style={{ marginTop: 28 }}>
          <h2>Share my location</h2>
          <p className="muted">Riders' live positions help dispatch and customers track progress.</p>
          <button className="button" onClick={shareLocation} style={{ marginTop: 12 }}>
            Share my current location
          </button>
          {locationStatus && <p className="muted" style={{ marginTop: 10 }}>{locationStatus}</p>}
        </div>

        <div className="header-row" style={{ marginTop: 36 }}>
          <div>
            <p className="eyebrow">Assigned to me</p>
            <h2>My deliveries</h2>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : deliveries.length === 0 ? (
          <p className="muted">No deliveries assigned to you yet.</p>
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

  // Admin view: read-only roster. Assigning a rider to a specific delivery
  // happens from that delivery's details page.
  return (
    <>
      <p className="eyebrow">Dispatch desk</p>
      <h1>Riders</h1>
      <p className="muted">To assign a rider, open a delivery and use the assign form there.</p>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : riders.length === 0 ? (
        <p className="muted">No riders registered yet.</p>
      ) : (
        <div className="grid feature-grid" style={{ marginTop: 24 }}>
          {riders.map((rider) => (
            <div className="card" key={rider._id}>
              <h3>{rider.name}</h3>
              <p className="muted">{rider.email}</p>
              <p className="muted">{rider.isAvailable ? 'Available' : 'Busy'}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
