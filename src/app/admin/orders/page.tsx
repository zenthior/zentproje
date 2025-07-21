"use client"

import { useState, useEffect } from 'react'
import { Package, User, Calendar, DollarSign, Eye, CheckCircle, XCircle, Clock, RefreshCw, Trash2, X, AlertTriangle } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  currency: string
  siteName: string
  domain?: string
  description?: string
  themeColor?: string
  extraFeatures?: string
  sslCertificate?: boolean
  analytics?: boolean
  fastLoading?: boolean
  mobileResponsive?: boolean
  socialMedia?: boolean
  guestPurchase?: boolean
  designTemplate?: string
  paymentStatus: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  package: {
    id: string
    name: string
    price: number
    description?: string
  }
}

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'success'
}

interface NotificationModalProps {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

// Onay Modalı Bileşeni
const ConfirmModal = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, type = 'warning' }: ConfirmModalProps) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          confirmBg: 'bg-red-600 hover:bg-red-700',
          iconBg: 'bg-red-100'
        }
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-400" />,
          confirmBg: 'bg-green-600 hover:bg-green-700',
          iconBg: 'bg-green-100'
        }
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          iconBg: 'bg-yellow-100'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6">
            {styles.icon}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 ${styles.confirmBg} text-white rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Bildirim Modalı Bileşeni
const NotificationModal = ({ isOpen, title, message, type, onClose }: NotificationModalProps) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-400" />,
          bgColor: 'bg-green-900/20 border-green-600'
        }
      case 'error':
        return {
          icon: <XCircle className="w-12 h-12 text-red-400" />,
          bgColor: 'bg-red-900/20 border-red-600'
        }
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-blue-400" />,
          bgColor: 'bg-blue-900/20 border-blue-600'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6">
            {styles.icon}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Modal state'leri
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'success'
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: () => {},
    type: 'warning'
  })
  
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  useEffect(() => {
    fetchOrders()
    
    // Her 3 saniyede bir otomatik yenile
    const interval = setInterval(() => {
      fetchOrders(true) // true = sessiz yenileme
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) {
        setIsRefreshing(true)
      }
      
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        
        // Yeni sipariş kontrolü
        if (orders.length > 0 && data.length > orders.length) {
          const newOrdersCount = data.length - orders.length
          console.log(`${newOrdersCount} yeni sipariş tespit edildi!`)
          
          // Yeni siparişler için bildirim göster
          if (typeof window !== 'undefined') {
            const toast = document.createElement('div')
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-bounce'
            toast.innerHTML = `
              <div class="flex items-center gap-2">
                <span class="text-xl">🔔</span>
                <div>
                  <div class="font-semibold">Yeni Sipariş!</div>
                  <div class="text-sm opacity-90">${newOrdersCount} yeni sipariş geldi</div>
                </div>
              </div>
            `
            document.body.appendChild(toast)
            
            setTimeout(() => {
              if (document.body.contains(toast)) {
                document.body.removeChild(toast)
              }
            }, 5000)
          }
        }
        
        setOrders(data)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Orders fetch error:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setNotificationModal({
      isOpen: true,
      title,
      message,
      type
    })
  }

  const showConfirmation = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'success' = 'warning', confirmText = 'Evet', cancelText = 'Hayır') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm()
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
      type
    })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        showNotification('Başarılı!', 'Sipariş durumu başarıyla güncellendi.', 'success')
      } else {
        console.error('Status update error:', data)
        showNotification('Hata!', `Durum güncellenirken hata oluştu: ${data.error || 'Bilinmeyen hata'}`, 'error')
      }
    } catch (error) {
      console.error('Status update error:', error)
      showNotification('Hata!', 'Durum güncellenirken hata oluştu!', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20'
      case 'CONFIRMED': return 'text-blue-400 bg-blue-400/20'
      case 'IN_PROGRESS': return 'text-purple-400 bg-purple-400/20'
      case 'COMPLETED': return 'text-green-400 bg-green-400/20'
      case 'CANCELLED': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Beklemede'
      case 'CONFIRMED': return 'Onaylandı'
      case 'IN_PROGRESS': return 'Devam Ediyor'
      case 'COMPLETED': return 'Tamamlandı'
      case 'CANCELLED': return 'İptal Edildi'
      default: return status
    }
  }

  const deleteOrder = async (orderId: string) => {
    showConfirmation(
      'Siparişi Sil',
      'Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          const data = await response.json()
          
          if (response.ok) {
            setOrders(orders.filter(order => order.id !== orderId))
            showNotification('Başarılı!', 'Sipariş başarıyla silindi!', 'success')
          } else {
            console.error('Delete error:', data)
            showNotification('Hata!', `Sipariş silinirken hata oluştu: ${data.error || 'Bilinmeyen hata'}`, 'error')
          }
        } catch (error) {
          console.error('Delete error:', error)
          showNotification('Hata!', 'Sipariş silinirken hata oluştu!', 'error')
        }
      },
      'danger',
      'Sil',
      'İptal'
    )
  }

  const confirmOrder = async (orderId: string) => {
    showConfirmation(
      'Siparişi Onayla',
      'Bu siparişi onaylamak istediğinizden emin misiniz?',
      () => updateOrderStatus(orderId, 'CONFIRMED'),
      'success',
      'Onayla',
      'İptal'
    )
  }

  const cancelOrder = async (orderId: string) => {
    showConfirmation(
      'Siparişi İptal Et',
      'Bu siparişi iptal etmek istediğinizden emin misiniz?',
      () => updateOrderStatus(orderId, 'CANCELLED'),
      'warning',
      'İptal Et',
      'Vazgeç'
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Siparişler</h1>
          <p className="text-gray-400">Gelen siparişleri yönetin</p>
        </div>
        
        {/* Yenileme Butonu ve Son Güncelleme */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Son güncelleme: {lastRefresh.toLocaleTimeString('tr-TR')}
          </div>
          <button
            onClick={() => fetchOrders()}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {/* Otomatik Yenileme Durumu */}
      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
        <div className="flex items-center gap-2 text-blue-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Otomatik yenileme aktif (3 saniyede bir)</span>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-400">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Toplam Gelir</p>
              <p className="text-2xl font-bold text-blue-400">
                ₺{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Siparişler Tablosu */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{order.user.name}</div>
                      <div className="text-sm text-gray-400">{order.user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {order.package.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ₺{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {/* Görüntüle Butonu */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailModalOpen(true)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Onayla Butonu */}
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => confirmOrder(order.id)}
                          className="text-green-400 hover:text-green-300"
                          title="Onayla"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* İptal Et Butonu */}
                      {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="İptal Et"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Sil Butonu */}
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sipariş Detay Modalı */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Sipariş Detayları</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sipariş Bilgileri */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Sipariş Bilgileri</h3>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sipariş Numarası</p>
                  <p className="text-white font-medium">{selectedOrder.orderNumber}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Site Adı</p>
                  <p className="text-white font-medium">{selectedOrder.siteName}</p>
                </div>
                
                {selectedOrder.domain && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Domain</p>
                    <p className="text-white font-medium">{selectedOrder.domain}</p>
                  </div>
                )}
                
                {selectedOrder.description && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Site Açıklaması</p>
                    <p className="text-white font-medium">{selectedOrder.description}</p>
                  </div>
                )}
                
                {selectedOrder.themeColor && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Tema Rengi</p>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded border border-gray-500" style={{backgroundColor: selectedOrder.themeColor}}></span>
                      <span className="text-white font-medium">{selectedOrder.themeColor}</span>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Tutar</p>
                  <p className="text-white font-medium">₺{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Durum</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sipariş Tarihi</p>
                  <p className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</p>
                </div>
              </div>
              
              {/* Müşteri ve Paket Bilgileri */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Müşteri Bilgileri</h3>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Ad Soyad</p>
                  <p className="text-white font-medium">{selectedOrder.user.name}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">E-posta</p>
                  <p className="text-white font-medium">{selectedOrder.user.email}</p>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-4 mt-6">Paket Bilgileri</h3>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Paket Adı</p>
                  <p className="text-white font-medium">{selectedOrder.package.name}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Paket Fiyatı</p>
                  <p className="text-white font-medium">₺{selectedOrder.package.price.toLocaleString()}</p>
                </div>
                
                {selectedOrder.package.description && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Paket Açıklaması</p>
                    <p className="text-white font-medium">{selectedOrder.package.description}</p>
                  </div>
                )}
                
                {/* Seçilen Tasarım */}
                {selectedOrder.designTemplate && (() => {
                  try {
                    const design = JSON.parse(selectedOrder.designTemplate)
                    return (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Seçilen Tasarım</p>
                        <p className="text-white font-medium">{design.name}</p>
                        <p className="text-gray-400 text-xs">{design.category} - ₺{design.price.toLocaleString()}</p>
                      </div>
                    )
                  } catch {
                    return null
                  }
                })()}
              </div>
              
              {/* Site Seçenekleri ve Ekstra Özellikler */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Site Seçenekleri</h3>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-3">Aktif Özellikler</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.sslCertificate ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">SSL Sertifikası</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.analytics ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">Google Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.fastLoading ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">Hızlı Yükleme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.mobileResponsive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">Mobil Uyumlu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.socialMedia ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">Sosyal Medya</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedOrder.guestPurchase ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-white text-sm">Kayıtsız Satın Alım</span>
                    </div>
                  </div>
                </div>
                
                {/* Ekstra Özellikler */}
                {selectedOrder.extraFeatures && (() => {
                  try {
                    const features = JSON.parse(selectedOrder.extraFeatures)
                    if (features.length > 0) {
                      const featureNames = {
                        'blog': 'Blog Sistemi',
                        'ecommerce': 'E-Ticaret Modülü',
                        'booking': 'Randevu Sistemi',
                        'membership': 'Üyelik Sistemi',
                        'chat': 'Canlı Destek',
                        'social': 'Sosyal Medya Entegrasyonu',
                        'multilang': 'Çoklu Dil Desteği',
                        'seo': 'Gelişmiş SEO Optimizasyonu',
                        'backup': 'Otomatik Yedekleme',
                        'cdn': 'CDN Hızlandırma',
                        'security': 'Gelişmiş Güvenlik',
                        'performance': 'Performans Optimizasyonu'
                      }
                      
                      return (
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-3">Ekstra Özellikler</p>
                          <div className="space-y-2">
                            {features.map((featureId: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span className="text-white text-sm">{featureNames[featureId as keyof typeof featureNames] || featureId}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                  } catch {
                    return null
                  }
                  return null
                })()}
              </div>
            </div>
            
            {/* Modal Alt Butonlar */}
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-700">
              {selectedOrder.status === 'PENDING' && (
                <button
                  onClick={() => {
                    confirmOrder(selectedOrder.id)
                    setIsDetailModalOpen(false)
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Siparişi Onayla
                </button>
              )}
              
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Onay Modalı */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />
      
      {/* Bildirim Modalı */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}