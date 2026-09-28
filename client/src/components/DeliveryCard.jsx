import { Link } from 'react-router-dom'
// Define status labels for different delivery statuses
const STATUS_LABELS = {
  created: 'Awaiting pickup',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  failed: 'Failed',
}
// DeliveryCard component to display delivery information
export default function DeliveryCard({ delivery }) {
  return (
    <article className="card delivery-card">
      <header>
        <div>
          <p className="eyebrow">{delivery.trackingId}</p>
          <h3>{delivery.receiver?.name}</h3>
        </div>
        <span className="status">{STATUS_LABELS[delivery.status] || delivery.status}</span>
      </header>
      <p className="muted">{delivery.receiver?.address}</p>
      <Link className="button secondary" to={`/deliveries/${delivery.trackingId}`}>
        View details
      </Link>
    </article>
  )
}
