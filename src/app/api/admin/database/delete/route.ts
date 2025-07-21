import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    // Admin paneline giriş yapılmış olduğu varsayılır

    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 })
    }

    // Güvenlik kontrolü - sadece .json dosyalarına izin ver
    if (!filename.endsWith('.json') || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Geçersiz dosya adı' }, { status: 400 })
    }

    const backupsDir = path.join(process.cwd(), 'backups')
    const filePath = path.join(backupsDir, filename)

    // Dosyanın var olup olmadığını kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 404 })
    }

    // Dosyayı sil
    fs.unlinkSync(filePath)

    return NextResponse.json({ 
      success: true, 
      message: `${filename} başarıyla silindi` 
    })

  } catch (error) {
    console.error('Yedek dosyası silme hatası:', error)
    return NextResponse.json(
      { error: 'Dosya silme işlemi başarısız' },
      { status: 500 }
    )
  }
}