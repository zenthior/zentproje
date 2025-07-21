'use client'

import { useState, useEffect } from 'react'
import { Bell, Package } from 'lucide-react'

interface Notification {
  id: string
  type: 'order' | 'contact' | 'user'
  title: string
  message: string
  createdAt: string
  read: boolean
}

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastNotificationCount, setLastNotificationCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('lastNotificationCount') || '0')
    }
    return 0
  })
  const [showTopNotification, setShowTopNotification] = useState(false)
  const [topNotificationMessage, setTopNotificationMessage] = useState('')


  useEffect(() => {
    // Admin bildirimleri için API çağrısı
    fetchAdminNotifications()
    
    // Her 2 saniyede bir kontrol et (anında bildirim için)
    const interval = setInterval(fetchAdminNotifications, 2000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchAdminNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        const newUnreadCount = data.filter((n: Notification) => !n.read).length
        
        // Yeni bildirim varsa üst bildirim göster
        if (newUnreadCount > lastNotificationCount) {
          // Yeni sipariş bildirimi varsa üst bildirimi göster
          const newOrderNotifications = data.filter((n: Notification) => 
            !n.read && n.type === 'order'
          )
          
          if (newOrderNotifications.length > 0) {
            showTopNotificationAlert('Yeni Sipariş Geldi!')
          }
        }
        
        setNotifications(data)
        setUnreadCount(newUnreadCount)
        setLastNotificationCount(newUnreadCount)
        
        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastNotificationCount', newUnreadCount.toString())
        }
      }
    } catch (error) {
      console.error('Admin notifications fetch error:', error)
    }
  }



  const showTopNotificationAlert = (message: string) => {
    setTopNotificationMessage(message)
    setShowTopNotification(true)
    
    // 5 saniye sonra bildirimi gizle
    setTimeout(() => {
      setShowTopNotification(false)
    }, 5000)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      })
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PUT',
        credentials: 'include'
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      setLastNotificationCount(0)
      
      // localStorage'ı güncelle
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastNotificationCount', '0')
      }
    } catch (error) {
      console.error('Mark all as read error:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'contact':
        return <Bell className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <>
      {/* Üst Bildirim */}
      {showTopNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            <span className="font-semibold">{topNotificationMessage}</span>
            <button
              onClick={() => setShowTopNotification(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Bildirimler"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-10 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bildirimler
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Henüz bildirim yok
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </>
  )
}