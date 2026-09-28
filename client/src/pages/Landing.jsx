import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  const features = [
    {
      title: 'Create deliveries in seconds',
      body: 'Capture sender, receiver, and parcel details, and get a shareable tracking number instantly.',
    },
    {
      title: 'Assign the right rider',
      body: 'Dispatch parcels to available riders and keep every assignment logged in the delivery history.',
    },
    {
      title: 'Live status for everyone',
      body: 'Customers track parcels with just a tracking number, updated in real time as riders move.',
    },
  ]

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Courier operations, simplified</p>
        <h1>Move every parcel with confidence.</h1>
        <p className="muted hero-sub">
          Parcel / Pulse helps your team create deliveries, assign riders, and give customers
          live visibility into every stage of the journey.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link className="button" to="/dashboard">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link className="button" to="/signup">
                Get started
              </Link>
              <Link className="button secondary" to="/login">
                Sign in
              </Link>
            </>
          )}
          <Link className="button ghost" to="/track">
            Track a parcel
          </Link>
        </div>
      </section>

      <section className="grid feature-grid">
        {features.map((feature) => (
          <div className="card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p className="muted">{feature.body}</p>
          </div>
        ))}
      </section>
    </>
  )
}
