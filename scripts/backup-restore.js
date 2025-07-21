const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Veritabanı yedekleme fonksiyonu
async function backupDatabase() {
  console.log('📦 Veritabanı yedekleniyor...')
  
  try {
    const backup = {
      users: await prisma.user.findMany(),
      servicePackages: await prisma.servicePackage.findMany(),
      projects: await prisma.project.findMany(),
      stories: await prisma.story.findMany(),
      orders: await prisma.order.findMany(),
      subscriptions: await prisma.subscription.findMany(),
      contacts: await prisma.contact.findMany(),
      blogPosts: await prisma.blogPost.findMany(),
      notifications: await prisma.notification.findMany(),
      adminNotifications: await prisma.adminNotification.findMany(),
      timestamp: new Date().toISOString()
    }
    
    const backupDir = path.join(__dirname, '..', 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    const filepath = path.join(backupDir, filename)
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2))
    console.log(`✅ Yedek oluşturuldu: ${filename}`)
    
    return filepath
  } catch (error) {
    console.error('❌ Yedekleme hatası:', error)
    throw error
  }
}

// Veritabanı geri yükleme fonksiyonu
async function restoreDatabase(backupPath) {
  console.log('🔄 Veritabanı geri yükleniyor...')
  
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Yedek dosyası bulunamadı: ${backupPath}`)
    }
    
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
    
    // Önce mevcut verileri temizle (foreign key kısıtlamaları nedeniyle sırayla)
    await prisma.adminNotification.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.blogPost.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.order.deleteMany()
    await prisma.story.deleteMany()
    await prisma.project.deleteMany()
    await prisma.servicePackage.deleteMany()
    await prisma.user.deleteMany()
    
    // Verileri geri yükle
    if (backup.users?.length > 0) {
      await prisma.user.createMany({ data: backup.users })
      console.log(`✅ ${backup.users.length} kullanıcı geri yüklendi`)
    }
    
    if (backup.servicePackages?.length > 0) {
      await prisma.servicePackage.createMany({ data: backup.servicePackages })
      console.log(`✅ ${backup.servicePackages.length} paket geri yüklendi`)
    }
    
    if (backup.projects?.length > 0) {
      await prisma.project.createMany({ data: backup.projects })
      console.log(`✅ ${backup.projects.length} proje geri yüklendi`)
    }
    
    if (backup.stories?.length > 0) {
      await prisma.story.createMany({ data: backup.stories })
      console.log(`✅ ${backup.stories.length} hikaye geri yüklendi`)
    }
    
    if (backup.orders?.length > 0) {
      await prisma.order.createMany({ data: backup.orders })
      console.log(`✅ ${backup.orders.length} sipariş geri yüklendi`)
    }
    
    if (backup.subscriptions?.length > 0) {
      await prisma.subscription.createMany({ data: backup.subscriptions })
      console.log(`✅ ${backup.subscriptions.length} abonelik geri yüklendi`)
    }
    
    if (backup.contacts?.length > 0) {
      await prisma.contact.createMany({ data: backup.contacts })
      console.log(`✅ ${backup.contacts.length} iletişim geri yüklendi`)
    }
    
    if (backup.blogPosts?.length > 0) {
      await prisma.blogPost.createMany({ data: backup.blogPosts })
      console.log(`✅ ${backup.blogPosts.length} blog yazısı geri yüklendi`)
    }
    
    if (backup.notifications?.length > 0) {
      await prisma.notification.createMany({ data: backup.notifications })
      console.log(`✅ ${backup.notifications.length} bildirim geri yüklendi`)
    }
    
    if (backup.adminNotifications?.length > 0) {
      await prisma.adminNotification.createMany({ data: backup.adminNotifications })
      console.log(`✅ ${backup.adminNotifications.length} admin bildirimi geri yüklendi`)
    }
    
    console.log('🎉 Veritabanı başarıyla geri yüklendi!')
  } catch (error) {
    console.error('❌ Geri yükleme hatası:', error)
    throw error
  }
}

// En son yedek dosyasını bul
function getLatestBackup() {
  const backupDir = path.join(__dirname, '..', 'backups')
  if (!fs.existsSync(backupDir)) {
    return null
  }
  
  const files = fs.readdirSync(backupDir)
    .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
    .sort()
    .reverse()
  
  return files.length > 0 ? path.join(backupDir, files[0]) : null
}

// Komut satırı argümanlarını kontrol et
const command = process.argv[2]

async function main() {
  try {
    if (command === 'backup') {
      await backupDatabase()
    } else if (command === 'restore') {
      const backupPath = process.argv[3] || getLatestBackup()
      if (!backupPath) {
        console.error('❌ Geri yüklenecek yedek dosyası bulunamadı')
        process.exit(1)
      }
      await restoreDatabase(backupPath)
    } else {
      console.log('Kullanım:')
      console.log('  node scripts/backup-restore.js backup')
      console.log('  node scripts/backup-restore.js restore [yedek-dosyası]')
    }
  } catch (error) {
    console.error('❌ İşlem başarısız:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

module.exports = { backupDatabase, restoreDatabase, getLatestBackup }