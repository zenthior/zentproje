import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Son kontrol zamanlarını takip etmek için geçici bellek
const lastCheckTimes = new Map<string, Date>()

export async function GET(request: NextRequest) {
  try {
    // Token kontrolü
    const token = request.cookies.get('token')?.value || request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const userId = decoded.userId
    const now = new Date()
    
    // Son kontrol zamanını al (yoksa 30 saniye öncesi)
    const lastCheck = lastCheckTimes.get(userId) || new Date(now.getTime() - 30000)

    // Tüm bildirimleri al
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Yeni bildirimleri tespit et (son kontrolden sonra oluşturulanlar)
    const newNotifications = notifications.filter(n => 
      new Date(n.createdAt) > lastCheck && !n.read
    )

    // Son kontrol zamanını güncelle
    lastCheckTimes.set(userId, now)

    // Okunmamış bildirim sayısını hesapla
    const unreadCount = notifications.filter(n => !n.read).length

    console.log(`Kullanıcı ${userId} için:`, {
      totalNotifications: notifications.length,
      newNotifications: newNotifications.length,
      unreadCount,
      lastCheck: lastCheck.toISOString()
    })

    return NextResponse.json({ 
      notifications: notifications.map(n => ({
        id: n.id,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
        read: n.read
      })),
      newNotifications: newNotifications.map(n => ({
        id: n.id,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
        read: n.read
      })),
      unreadCount 
    })

  } catch (error) {
    console.error('Bildirimler alınamadı:', error)
    return NextResponse.json({ error: 'Bildirimler alınamadı' }, { status: 500 })
  }
}

// Bildirimi okundu olarak işaretle
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { notificationId } = await request.json()

    if (notificationId) {
      // Belirli bildirimi okundu olarak işaretle
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      })
    } else {
      // Tüm bildirimleri okundu olarak işaretle
      await prisma.notification.updateMany({
        data: { read: true }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Bildirim güncellenemedi:', error)
    return NextResponse.json({ error: 'Bildirim güncellenemedi' }, { status: 500 })
  }
}