import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Token kontrolü kaldırıldı - direkt erişim
    console.log('Admin notifications API called')

    // Veritabanından bildirimleri getir
    const notifications = await prisma.adminNotification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Son 50 bildirim
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Admin notifications error:', error)
    return NextResponse.json(
      { error: 'Bildirimler getirilemedi' },
      { status: 500 }
    )
  }
}