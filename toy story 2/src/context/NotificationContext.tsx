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
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [lastTransferUpdate, setLastTransferUpdate] = useState(0)
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
      (payload: { title: string; body: string; transferId: number; createdAt: string }) => {
        // Optimistic: increment badge immediately, then fetch real data from server
        setUnreadCount((prev) => prev + 1)
        setLastTransferUpdate(Date.now())
        // Refetch to populate the list with real DB IDs (avoids fake negative IDs)
        refetch()
        toast({
          title: payload.title,
          description: payload.body,
          variant: 'default',
          duration: 5000,
        })
      }
    )

    connection.start().catch((err: unknown) => {
      console.warn('[SignalR] connection failed:', err)
    })

    return () => {
      connection.stop()
      connectionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

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
      value={{ unreadCount, notifications, lastTransferUpdate, markOneAsRead, markAllRead, refetch }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
