/**
 * NotificationCenter — mounts once at app root, operates via side effects.
 * Only exports React components so Vite Fast Refresh works correctly.
 * Non-component helpers (notify) live in ./notify.tsx.
 */
import { useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useAppSelector } from '@/store'
import { notify } from './notify'

export const NotificationCenter = () => {
  const { user, isAuthenticated } = useAppSelector(s => s.auth)
  const { onNewOrder, onOrderStatusUpdate, onOrderUpdated, joinKitchen } = useSocket()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !user) return
    connectedRef.current = true

    if (user.role === 'admin' || user.role === 'staff') {
      joinKitchen()
      const unNew = onNewOrder(d => notify.newOrder(d.orderNumber, d.total, d.itemCount))
      const unUpd = onOrderUpdated(d => { if (d.status === 'ready') notify.orderReady(d.orderId) })
      return () => { unNew(); unUpd() }
    }

    if (user.role === 'customer') {
      const unStatus = onOrderStatusUpdate(d => notify.orderStatusChange(d.orderNumber, d.status))
      return () => { unStatus() }
    }
    // Intentionally narrowed to user?._id/user?.role (not the full `user` object)
    // to avoid re-subscribing sockets on unrelated profile field changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?._id, user?.role, joinKitchen, onNewOrder, onOrderUpdated, onOrderStatusUpdate])

  return null
}

export default NotificationCenter
