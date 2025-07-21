import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'

const execAsync = promisify(exec)

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

export async function POST(request: NextRequest) {
  try {
    // Admin paneline giriş yapılmış olduğu varsayılır

    console.log('🔄 Veritabanı yedekleme başlatılıyor...')
    
    // Backup script'ini çalıştır
    const projectRoot = process.cwd()
    const backupScript = path.join(projectRoot, 'scripts', 'backup-restore.js')
    
    const { stdout, stderr } = await execAsync(`node "${backupScript}" backup`, {
      cwd: projectRoot,
      timeout: 60000 // 60 saniye timeout
    })
    
    if (stderr && !stderr.includes('warning')) {
      console.error('Backup stderr:', stderr)
      return NextResponse.json(
        { error: 'Yedekleme sırasında hata oluştu', details: stderr },
        { status: 500 }
      )
    }
    
    // Çıktıdan dosya adını çıkar
    const outputLines = stdout.split('\n')
    const successLine = outputLines.find(line => line.includes('✅ Yedek oluşturuldu:'))
    const filename = successLine ? successLine.split(': ')[1]?.trim() : 'backup.json'
    
    console.log('✅ Yedekleme tamamlandı:', filename)
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı başarıyla yedeklendi',
      filename,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Yedekleme hatası:', error)
    
    return NextResponse.json(
      { 
        error: 'Yedekleme başarısız', 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}