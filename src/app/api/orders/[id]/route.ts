import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Sipariş durumu güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Admin token'ını kontrol et
    const adminToken = request.cookies.get('admin-token')?.value
    const authToken = request.cookies.get('auth-token')?.value
    
    const token = adminToken || authToken

    if (!token) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Admin kontrolü - özel admin kullanıcısı için kontrol
    if (decoded.userId === 'admin' && decoded.role === 'ADMIN') {
      // Admin kullanıcısı, direkt yetki ver
    } else {
      // Normal kullanıcılar için veritabanından kontrol
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (user?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Yetkiniz yok' },
          { status: 403 }
        )
      }
    }

    const { status, paymentStatus } = await request.json()
    const orderId = params.id

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
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

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Sipariş güncellenemedi' },
      { status: 500 }
    )
  }
}

// Sipariş detayını getir
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
            price: true,
            description: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Sipariş getirilemedi' },
      { status: 500 }
    )
  }
}

// Sipariş silme
// Sipariş silme
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Admin token'ını kontrol et
    const adminToken = request.cookies.get('admin-token')?.value
    const authToken = request.cookies.get('auth-token')?.value
    
    const token = adminToken || authToken

    if (!token) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Admin kontrolü - özel admin kullanıcısı için kontrol
    if (decoded.userId === 'admin' && decoded.role === 'ADMIN') {
      // Admin kullanıcısı, direkt yetki ver
    } else {
      // Normal kullanıcılar için veritabanından kontrol
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (user?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Yetkiniz yok' },
          { status: 403 }
        )
      }
    }

    const orderId = params.id

    // Siparişi sil
    await prisma.order.delete({
      where: { id: orderId }
    })

    return NextResponse.json({ message: 'Sipariş başarıyla silindi' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Sipariş silinemedi' },
      { status: 500 }
    )
  }
}