import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Admin token'ını kontrol et
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Admin token bulunamadı' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Admin kontrolü
    if (decoded.userId !== 'admin' || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: {
        id: 'admin',
        name: 'Admin',
        email: 'admin@zentproje.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Geçersiz admin token' },
      { status: 401 }
    )
  }
}