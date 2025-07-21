"use client"

import Link from 'next/link'
import { LayoutDashboard, FileText, Users, Package, Mail, Camera, Settings, LogOut } from 'lucide-react'
import AdminNotificationBell from '@/components/AdminNotificationBell'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Kontrol Paneli' },
  { href: '/admin/projects', icon: FileText, label: 'Projeler' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/stories', icon: Camera, label: 'Hikayeler' },
  { href: '/admin/users', icon: Users, label: 'Kullanıcılar' },
  { href: '/admin/packages', icon: Package, label: 'Paketler' },
  { href: '/admin/contacts', icon: Mail, label: 'İletişim' },
  { href: '/admin/orders', icon: Package, label: 'Siparişler' }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Login sayfasında auth kontrolü yapma
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage) {
      // Admin paneline şifre ile giriş yapıldığı varsayılır
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [isLoginPage])

  const handleLogout = async () => {
    try {
      // Admin logout endpoint'ini kullan
      const response = await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        console.log('Admin logout successful')
      }
    } catch (error) {
      console.error('Admin logout error:', error)
    } finally {
      // Her durumda login sayfasına yönlendir
      router.push('/admin/login')
    }
  }

  // Login sayfası için özel render
  if (isLoginPage) {
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        {children}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Admin paneli yükleniyor...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Admin girişi gerekli...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg relative">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ZentProje
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Yönetici Paneli</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                href="/admin/settings" 
                className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Ayarlar"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <AdminNotificationBell />
            </div>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Admin Çıkışı
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}