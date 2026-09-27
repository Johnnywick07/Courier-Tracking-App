import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// Joins the realtime tracking room for a given trackingId and returns
// the latest delivery update pushed by the backend, if any.
export default function useSocket(trackingId) {
  const [latestUpdate, setLatestUpdate] = useState(null)

  useEffect(() => {
    if (!trackingId) return undefined
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

    socket.emit('joinTracking', trackingId)
    socket.on('tracking:update', (delivery) => {
      if (delivery.trackingId === trackingId) setLatestUpdate(delivery)
    })

    return () => {
      socket.emit('leaveTracking', trackingId)
      socket.off('tracking:update')
      socket.disconnect()
    }
  }, [trackingId])

  return latestUpdate
}
