import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const ADMIN_PASSWORD = 'zentadmin91'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Admin Login Attempt ===')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { password } = body

    if (!password) {
      console.log('No password provided')
      return NextResponse.json(
        { error: 'Şifre gerekli' },
        { status: 400 }
      )
    }

    if (password !== ADMIN_PASSWORD) {
      console.log('Invalid password provided:', password)
      return NextResponse.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      )
    }

    console.log('Password correct, creating token...')
    
    // Admin token oluştur
    const token = jwt.sign(
      { 
        userId: 'admin',
        role: 'ADMIN',
        isAdmin: true
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('Token created successfully')

    const response = NextResponse.json({
      message: 'Giriş başarılı',
      user: {
        id: 'admin',
        name: 'Admin',
        email: 'admin@zentproje.com',
        role: 'ADMIN'
      }
    })

    // Eski auth-token cookie'sini temizle
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    // Admin için ayrı cookie kullan
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 saat
      path: '/'
    })

    console.log('Admin login successful, cookies set')
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error as Error).message },
      { status: 500 }
    )
  }
}