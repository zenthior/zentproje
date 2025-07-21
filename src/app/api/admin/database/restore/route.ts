import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
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
    const body = await request.json()
    const { filename } = body

    console.log('🔄 Veritabanı geri yükleme başlatılıyor...', filename || 'en son yedek')
    
    // Restore script'ini çalıştır
    const projectRoot = process.cwd()
    const backupScript = path.join(projectRoot, 'scripts', 'backup-restore.js')
    
    // Filename varsa onu kullan, yoksa en son yedeği kullan
    const command = filename 
      ? `node "${backupScript}" restore "${path.join(projectRoot, 'backups', filename)}"`
      : `node "${backupScript}" restore`
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectRoot,
      timeout: 120000 // 2 dakika timeout (restore daha uzun sürebilir)
    })
    
    if (stderr && !stderr.includes('warning')) {
      console.error('Restore stderr:', stderr)
      return NextResponse.json(
        { error: 'Geri yükleme sırasında hata oluştu', details: stderr },
        { status: 500 }
      )
    }
    
    console.log('✅ Geri yükleme tamamlandı')
    console.log('Restore output:', stdout)
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı başarıyla geri yüklendi',
      filename: filename || 'en son yedek',
      timestamp: new Date().toISOString(),
      details: stdout
    })
    
  } catch (error: any) {
    console.error('❌ Geri yükleme hatası:', error)
    
    return NextResponse.json(
      { 
        error: 'Geri yükleme başarısız', 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}