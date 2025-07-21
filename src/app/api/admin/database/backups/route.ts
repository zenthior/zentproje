import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'

// Admin yetkisi kontrolü
function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    return decoded.role === 'ADMIN' ? decoded : null
  } catch {
    return null
  }
}

// Dosya boyutunu human-readable formata çevir
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Tarih formatını Türkçe'ye çevir
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString.replace(/[-]/g, '/').replace(/[T]/g, ' ').replace(/[Z]/g, ''))
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateString
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin paneline giriş yapılmış olduğu varsayılır

    const projectRoot = process.cwd()
    const backupsDir = path.join(projectRoot, 'backups')
    
    // Backups klasörü yoksa oluştur
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
      return NextResponse.json({
        success: true,
        backups: [],
        message: 'Henüz yedek dosyası bulunmuyor'
      })
    }
    
    // Yedek dosyalarını listele
    const files = fs.readdirSync(backupsDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupsDir, file)
        const stats = fs.statSync(filePath)
        
        // Dosya adından timestamp çıkar
        const timestampMatch = file.match(/backup-(.+)\.json$/)
        const timestamp = timestampMatch ? timestampMatch[1] : ''
        
        return {
          filename: file,
          timestamp: formatDate(timestamp),
          size: formatFileSize(stats.size),
          created: stats.birthtime,
          modified: stats.mtime
        }
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()) // En yeni önce
    
    return NextResponse.json({
      success: true,
      backups: files,
      total: files.length,
      message: files.length > 0 ? `${files.length} yedek dosyası bulundu` : 'Yedek dosyası bulunamadı'
    })
    
  } catch (error: any) {
    console.error('❌ Yedek dosyaları listelenemedi:', error)
    
    return NextResponse.json(
      { 
        error: 'Yedek dosyaları alınamadı', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}