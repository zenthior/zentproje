'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  message: string
  createdAt: string
  read: boolean
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [audioPermission, setAudioPermission] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Ses izni iste ve AudioContext oluştur
  const requestAudioPermission = async () => {
    try {
      if (typeof window !== 'undefined') {
        // Kullanıcı etkileşimi ile AudioContext oluştur
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // AudioContext'i başlat
        if (context.state === 'suspended') {
          await context.resume()
        }
        
        setAudioContext(context)
        setAudioPermission(true)
        
        // Test sesi çal
        playNotificationSound(context)
        
        // Kullanıcıya bilgi ver
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]'
        toast.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xl">🔊</span>
            <div>
              <div class="font-semibold">Ses İzni Verildi!</div>
              <div class="text-sm opacity-90">Artık yeni siparişler için ses uyarısı alacaksınız.</div>
            </div>
          </div>
        `
        document.body.appendChild(toast)
        
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 3000)
      }
    } catch (error) {
      console.error('Ses izni alınamadı:', error)
    }
  }

  // Bildirim sesi çalma fonksiyonu
  const playNotificationSound = (context?: AudioContext) => {
    try {
      const ctx = context || audioContext
      if (!ctx) return
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Daha hoş bir bildirim sesi
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.4)
    } catch (error) {
      console.log('Ses çalınamadı:', error)
    }
  }

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/orders/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      })
      checkForNewOrders()
    } catch (error) {
      console.error('Bildirim güncellenemedi:', error)
    }
  }

  // Yeni siparişleri kontrol et
  const checkForNewOrders = async () => {
    try {
      const response = await fetch('/api/orders/notifications')
      if (response.ok) {
        const data = await response.json()
        
        console.log('API Response:', data) // Debug için
        
        // Yeni bildirimler varsa ses çal ve uyarı göster
        if (data.newNotifications && data.newNotifications.length > 0) {
          console.log('Yeni bildirimler bulundu:', data.newNotifications.length)
          
          if (audioPermission && audioContext) {
            playNotificationSound()
            console.log('Ses çalındı')
          } else {
            console.log('Ses izni yok veya AudioContext mevcut değil')
          }
          
          // Her yeni sipariş için uyarı göster
          data.newNotifications.forEach((notification: Notification, index: number) => {
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                const toast = document.createElement('div')
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-bounce'
                toast.style.marginTop = `${index * 80}px`
                toast.innerHTML = `
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🔔</span>
                    <div>
                      <div class="font-semibold">Yeni Sipariş!</div>
                      <div class="text-sm opacity-90">${notification.message}</div>
                    </div>
                  </div>
                `
                document.body.appendChild(toast)
                
                // 5 saniye sonra kaldır
                setTimeout(() => {
                  if (document.body.contains(toast)) {
                    document.body.removeChild(toast)
                  }
                }, 5000)
              }
            }, index * 500)
          })
        }
        
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Bildirimler alınamadı:', error)
    }
  }

  // Her 5 saniyede bir kontrol et
  useEffect(() => {
    checkForNewOrders()
    const interval = setInterval(checkForNewOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Bildirim Çanı */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          // İlk tıklamada ses izni iste
          if (!audioPermission) {
            requestAudioPermission()
          }
        }}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Ses izni göstergesi */}
        {!audioPermission && (
          <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Bildirim Modalı */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bildirimler
            </h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} okunmamış bildirim
              </p>
            )}
            {!audioPermission && (
              <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  💡 Ses uyarıları için bu butona tıklayın!
                </p>
              </div>
            )}
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
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm text-gray-900 dark:text-white">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('tr-TR')}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
      
      {/* Modal dışına tıklandığında kapat */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  )
}