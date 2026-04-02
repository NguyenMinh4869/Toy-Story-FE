import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as signalR from '@microsoft/signalr'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  type NotificationDto,
} from '@/services/notificationService'

// ─── Derive SignalR hub URL ───────────────────────────────────────────────────
// In production, VITE_API_BASE_URL = "https://<host>/api"  →  strip "/api" suffix
// In development, use relative path so Vite proxy tunnels the WebSocket
const getHubUrl = (): string => {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (apiBase) {
    return apiBase.replace(/\/api\/?$/, '') + '/notificationHub'
  }
  return '/notificationHub'
}

// ─── Context shape ────────────────────────────────────────────────────────────
interface NotificationContextType {
  unreadCount: number
  notifications: NotificationDto[]
  lastTransferUpdate: number
  lastNotificationUpdate: number
  lastPaymentUpdate: number
  markOneAsRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
  refetch: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [lastTransferUpdate, setLastTransferUpdate] = useState(0)
  const [lastPaymentUpdate, setLastPaymentUpdate] = useState(0)
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  const refetch = async () => {
    try {
      const [count, list] = await Promise.all([getUnreadCount(), getNotifications()])
      setUnreadCount(count)
      setNotifications(list)
    } catch {
      // silent — user may not yet have notifications
    }
  }

  useEffect(() => {
    // Wait for AuthProvider to finish reading localStorage before acting.
    // Without this guard the effect fires with isAuthenticated=false on every
    // cold mount and the connection is never started.
    if (isLoading) return

    if (!isAuthenticated) {
      setUnreadCount(0)
      setNotifications([])
      connectionRef.current?.stop()
      connectionRef.current = null
      return
    }

    refetch()

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        accessTokenFactory: () => localStorage.getItem('token') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = connection

    connection.on(
      'ReceiveNotification',
      (payload: {
        type?: string
        orderId?: number
        warehouseId?: number | null
        title?: string
        body?: string
        transferId?: number
        createdAt?: string
      }) => {
        console.log('[SignalR] received notification:', payload)

        // Always bump the unified timestamp so Dashboard & Orders re-fetch
        setLastTransferUpdate(Date.now())

        // 1. Admin Order Notification — only badge when warehouse is unassigned
        if (payload.type === 'NEW_ORDER' && payload.warehouseId === null) {
          setUnreadCount((prev) => prev + 1)
          refetch()
          toast({
            title: payload.title ?? 'Đơn hàng mới',
            description: payload.body,
            variant: 'default',
            duration: 5000,
          })
        // 2. Staff Transfer Notification — legacy payload: {transferId, title, ...}
        } else if (
          payload.type === 'TRANSFER' ||
          payload.transferId !== undefined ||
          payload.title?.includes('chuyển kho')
        ) {
          setUnreadCount((prev) => prev + 1)
          refetch()
          toast({
            title: payload.title ?? 'Thông báo mới',
            description: payload.body,
            variant: 'default',
            duration: 5000,
          })
        }
      }
    )

    connection.on('PaymentConfirmed', () => {
      setLastPaymentUpdate(Date.now())
    })

    console.log('[SignalR] attempting to connect...')
    connection.start().catch((err: unknown) => {
      console.warn('[SignalR] connection failed:', err)
    })

    return () => {
      connection.stop()
      connectionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading])

  const markOneAsRead = async (id: number) => {
    await markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllRead = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, lastTransferUpdate, lastNotificationUpdate: lastTransferUpdate, lastPaymentUpdate, markOneAsRead, markAllRead, refetch }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
