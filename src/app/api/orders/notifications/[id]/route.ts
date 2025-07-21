import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Bildirimler için geçici depolama (production'da Redis kullanın)
let userNotifications: { [userId: string]: any[] } = {}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const userId = decoded.userId
    const notificationId = params.id

    // Kullanıcının bildirimlerini güncelle
    if (userNotifications[userId]) {
      userNotifications[userId] = userNotifications[userId].map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Bildirim güncellenemedi:', error)
    return NextResponse.json({ error: 'Bildirim güncellenemedi' }, { status: 500 })
  }
}