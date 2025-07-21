import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password alanını dahil etmiyoruz güvenlik için
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Role enum'unu string'e çevir ve status ekle
    const formattedUsers = users.map(user => ({
      ...user,
      role: user.role.toLowerCase() as 'admin' | 'user',
      status: 'active' as const, // Şimdilik tüm kullanıcılar aktif
      lastLogin: null // Bu alan şimdilik yok, ileride eklenebilir
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Kullanıcılar yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kullanıcılar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, status } = await request.json()

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Ad ve e-posta zorunludur' },
        { status: 400 }
      )
    }

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role?.toUpperCase() || 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const formattedUser = {
      ...user,
      role: user.role.toLowerCase() as 'admin' | 'user',
      status: 'active' as const,
      lastLogin: null
    }

    return NextResponse.json(formattedUser, { status: 201 })
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}