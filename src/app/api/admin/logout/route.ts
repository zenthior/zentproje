import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Admin çıkışı başarılı' })
  
  // Admin token'ını temizle
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
  
  return response
}