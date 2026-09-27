const STATUS_LABELS = {
  created: 'Delivery created',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  failed: 'Failed',
}

// StatusTimeline component to display delivery status updates
export default function StatusTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="muted">No status updates yet.</p>
  }

  const events = history
    .slice()
    .reverse()
    .map((entry) => ({
      label: STATUS_LABELS[entry.status] || entry.status,
      time: new Date(entry.timestamp).toLocaleString(),
      note: entry.note,
    }))

  return (
    <div className="timeline">
      {events.map((event, idx) => (
        <div className="timeline-item" key={idx}>
          <span className="timeline-dot" />
          <div>
            <strong>{event.label}</strong>
            <div className="muted">{event.time}</div>
            {event.note && <div className="muted">{event.note}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
