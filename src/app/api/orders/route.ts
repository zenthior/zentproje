import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Siparişleri getir (Admin için)
export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Siparişler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const userId = decoded.userId

    const orderData = await request.json()

    // Sipariş numarası oluştur
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    })

    // Admin(ler) için bildirim oluştur
    try {
      await prisma.adminNotification.create({
        data: {
          type: 'order',
          title: 'Yeni Sipariş',
          message: `${order.user.name || 'Bilinmeyen'} tarafından yeni sipariş: ${order.package.name} (${order.orderNumber})`,
          relatedId: order.id
        }
      })
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError)
      // Bildirim hatası sipariş oluşturulmasını engellemez
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { 
        error: 'Sipariş oluşturulamadı', 
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}