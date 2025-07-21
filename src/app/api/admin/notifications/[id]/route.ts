import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Admin girişi gerekli' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(adminToken, JWT_SECRET) as any
    
    if (decoded.userId !== 'admin' || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const notificationId = params.id

    const updatedNotification = await prisma.adminNotification.update({
      where: { id: notificationId },
      data: { read: true }
    })

    return NextResponse.json({ 
      success: true, 
      notification: updatedNotification 
    })
  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { error: 'Bildirim güncellenemedi' },
      { status: 500 }
    )
  }
}