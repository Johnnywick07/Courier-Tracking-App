import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import StatusTimeline from '../components/StatusTimeline'
import RiderAssignForm from '../components/RiderAssignForm'
import useSocket from '../hooks/useSocket'
import { useAuth } from '../context/AuthContext'

const STATUS_LABELS = {
  created: 'Awaiting pickup',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  failed: 'Failed',
}

const NEXT_STAGE = {
  created: 'picked_up',
  picked_up: 'in_transit',
  in_transit: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export default function DeliveryDetails() {
  const { id: trackingId } = useParams()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const { user } = useAuth()
  const liveUpdate = useSocket(trackingId)

  const fetchDelivery = () => {
    setLoading(true)
    api
      .get(`/deliveries/track/${trackingId}`)
      .then(({ data }) => setDelivery(data))
      .catch(() => setError('Delivery not found'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDelivery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingId])

  useEffect(() => {
    if (liveUpdate) setDelivery(liveUpdate)
  }, [liveUpdate])

  const advanceStatus = async () => {
    if (!delivery) return
    const next = NEXT_STAGE[delivery.status]
    if (!next) return
    try {
      const { data } = await api.patch(`/deliveries/${delivery._id}/status`, {
        status: next,
        note,
      })
      setDelivery(data)
      setNote('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status')
    }
  }

  if (loading) return <p className="muted">Loading…</p>
  if (error && !delivery) return <p className="error-text">{error}</p>
  if (!delivery) return null

  const canUpdate =
    user &&
    (user.role === 'admin' ||
      (user.role === 'rider' && delivery.assignedRider?._id === user._id))

  return (
    <>
      <p className="eyebrow">Delivery details</p>
      <div className="header-row">
        <div>
          <h1>{delivery.trackingId}</h1>
          <p className="muted">Live updates for this shipment appear here.</p>
        </div>
        <span className="status">{STATUS_LABELS[delivery.status] || delivery.status}</span>
      </div>

      <div className="grid feature-grid">
        <div className="card">
          <h3>Sender</h3>
          <p className="muted">{delivery.sender.name}</p>
          <p className="muted">{delivery.sender.phone}</p>
          <p className="muted">{delivery.sender.address}</p>
        </div>
        <div className="card">
          <h3>Receiver</h3>
          <p className="muted">{delivery.receiver.name}</p>
          <p className="muted">{delivery.receiver.phone}</p>
          <p className="muted">{delivery.receiver.address}</p>
        </div>
        <div className="card">
          <h3>Parcel</h3>
          <p className="muted">{delivery.parcel.description}</p>
          <p className="muted">{delivery.parcel.weightKg} kg</p>
          <p className="muted">
            Rider: {delivery.assignedRider?.name || 'Unassigned'}
          </p>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2>Assign a rider</h2>
          <RiderAssignForm deliveryId={delivery._id} onAssigned={setDelivery} />
        </div>
      )}

      {canUpdate && NEXT_STAGE[delivery.status] && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2>Update status</h2>
          <div className="form-grid">
            <label>
              Note (optional)
              <input value={note} onChange={(event) => setNote(event.target.value)} />
            </label>
            <button className="button" onClick={advanceStatus}>
              Mark as {STATUS_LABELS[NEXT_STAGE[delivery.status]]}
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Status timeline</h2>
        <StatusTimeline history={delivery.statusHistory} />
      </div>
    </>
  )
}
