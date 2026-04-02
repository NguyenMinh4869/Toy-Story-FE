import { apiGet, apiPut } from './apiClient'

export interface NotificationDto {
  notificationId: number
  title: string
  body: string
  transferId: number | null
  isRead: boolean
  createdAt: string
}

export const getUnreadCount = async (): Promise<number> => {
  const res = await apiGet<number>('/notifications/unread-count', undefined, true)
  return res.data
}

export const getNotifications = async (page = 1, limit = 20): Promise<NotificationDto[]> => {
  const res = await apiGet<NotificationDto[]>(
    `/notifications?page=${page}&limit=${limit}`,
    undefined,
    true
  )
  return res.data
}

export const markAsRead = async (id: number): Promise<void> => {
  await apiPut(`/notifications/${id}/read`)
}

export const markAllAsRead = async (): Promise<void> => {
  await apiPut('/notifications/read-all')
}
