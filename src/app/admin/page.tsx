"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, FileText, Mail, Package, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  totalUsers: number
  totalPosts: number
  totalContacts: number
  totalPackages: number
  monthlyGrowth: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalUsers: 0,
    totalPosts: 0,
    totalContacts: 0,
    totalPackages: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    // Gerçek API çağrısı burada olacak
    // Mock veriler kaldırıldı
    setStats({
      totalProjects: 0,
      totalUsers: 0,
      totalPosts: 0,
      totalContacts: 0,
      totalPackages: 0,
      monthlyGrowth: 0
    })
  }, [])

  const statCards = [
    {
      title: 'Toplam Projeler',
      value: stats.totalProjects,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Kullanıcılar',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Blog Yazıları',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'İletişim Mesajları',
      value: stats.totalContacts,
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Hizmet Paketleri',
      value: stats.totalPackages,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Aylık Büyüme',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kontrol Paneli
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Projeler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz proje bulunmuyor.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son İletişim Mesajları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz mesaj bulunmuyor.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}