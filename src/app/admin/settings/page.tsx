"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle, Clock, Trash2, Settings, Globe, Zap } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BackupFile {
  filename: string
  timestamp: string
  size: string
}

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('backup')
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [lastBackup, setLastBackup] = useState<string | null>(null)

  const categories = [
    { id: 'site', name: 'Site Ayarları', icon: Globe, description: 'Genel site yapılandırması' },
    { id: 'features', name: 'Özellikler', icon: Zap, description: 'Site özellikleri ve modüller' },
    { id: 'backup', name: 'Yedekleme', icon: Database, description: 'Veritabanı yedekleme ve geri yükleme' }
  ]

  // Veritabanı yedekleme
  const handleBackup = async () => {
    setIsBackingUp(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/database/backup', {
        method: 'POST',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: `Yedekleme başarılı: ${data.filename}` })
        setLastBackup(new Date().toLocaleString('tr-TR'))
        await fetchBackupFiles()
      } else {
        setMessage({ type: 'error', text: data.error || 'Yedekleme başarısız' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Yedekleme sırasında hata oluştu' })
    } finally {
      setIsBackingUp(false)
    }
  }

  // Veritabanı geri yükleme
  const handleRestore = async (filename?: string) => {
    if (!filename && backupFiles.length === 0) {
      setMessage({ type: 'error', text: 'Geri yüklenecek yedek dosyası bulunamadı' })
      return
    }
    
    const confirmRestore = confirm(
      `Veritabanını geri yüklemek istediğinizden emin misiniz?\n\n` +
      `Bu işlem mevcut tüm verileri silecek ve seçilen yedekten geri yükleyecektir.\n` +
      `Yedek dosyası: ${filename || 'En son yedek'}`
    )
    
    if (!confirmRestore) return
    
    setIsRestoring(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/database/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ filename })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Veritabanı başarıyla geri yüklendi' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Geri yükleme başarısız' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Geri yükleme sırasında hata oluştu' })
    } finally {
      setIsRestoring(false)
    }
  }

  // Yedek dosyasını sil
  const handleDeleteBackup = async (filename: string) => {
    const confirmDelete = confirm(
      `"${filename}" dosyasını silmek istediğinizden emin misiniz?\n\n` +
      `Bu işlem geri alınamaz!`
    )
    
    if (!confirmDelete) return
    
    setIsDeleting(filename)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/database/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ filename })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        await fetchBackupFiles()
      } else {
        setMessage({ type: 'error', text: data.error || 'Silme işlemi başarısız' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Silme işlemi sırasında hata oluştu' })
    } finally {
      setIsDeleting(null)
    }
  }

  // Yedek dosyalarını listele
  const fetchBackupFiles = async () => {
    try {
      const response = await fetch('/api/admin/database/backups', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBackupFiles(data.backups || [])
      }
    } catch (error) {
      console.error('Yedek dosyaları alınamadı:', error)
    }
  }

  // Sayfa yüklendiğinde yedek dosyalarını getir
  useEffect(() => {
    fetchBackupFiles()
  }, [])

  const renderSiteSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Site Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Site ayarları yakında eklenecek</p>
          <p className="text-sm">Site başlığı, açıklama, logo ve diğer genel ayarlar</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderFeatureSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Özellik Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Özellik ayarları yakında eklenecek</p>
          <p className="text-sm">AI chatbot, bildirimler, e-posta ayarları ve diğer özellikler</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ayarlar</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistem ayarları ve yönetim paneli
        </p>
      </div>

      {/* Kategori Menüsü */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeCategory === category.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${
                    activeCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div>
                    <h3 className={`font-semibold ${
                      activeCategory === category.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mesaj gösterimi */}
      {message && (
        <Alert className={`${
          message.type === 'success' ? 'border-green-200 bg-green-50' :
          message.type === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
           message.type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
           <Clock className="h-4 w-4 text-blue-600" />}
          <AlertDescription className={`${
            message.type === 'success' ? 'text-green-800' :
            message.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* İçerik Alanı */}
      {activeCategory === 'site' && renderSiteSettings()}
      {activeCategory === 'features' && renderFeatureSettings()}
      {activeCategory === 'backup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Veritabanı Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
          {/* Yedekleme Bölümü */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Veritabanı Yedekleme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tüm veritabanı verilerinizi güvenli bir şekilde yedekleyin
                </p>
                {lastBackup && (
                  <p className="text-xs text-gray-500 mt-1">
                    Son yedekleme: {lastBackup}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="flex items-center gap-2"
              >
                {isBackingUp ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isBackingUp ? 'Yedekleniyor...' : 'Yedekle'}
              </Button>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Yedekleme işlemi tüm tablolardan verileri JSON formatında kaydeder. 
                Bu işlem veritabanı boyutuna bağlı olarak birkaç dakika sürebilir.
              </AlertDescription>
            </Alert>
          </div>

          {/* Geri Yükleme Bölümü */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Veritabanı Geri Yükleme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Önceki yedeklerden veritabanını geri yükleyin
                </p>
              </div>
              <Button 
                onClick={() => handleRestore()}
                disabled={isRestoring || backupFiles.length === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isRestoring ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isRestoring ? 'Geri Yükleniyor...' : 'En Son Yedeği Geri Yükle'}
              </Button>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Dikkat:</strong> Geri yükleme işlemi mevcut tüm verileri silecek ve 
                seçilen yedekten geri yükleyecektir. Bu işlem geri alınamaz!
              </AlertDescription>
            </Alert>
          </div>

          {/* Yedek Dosyaları Listesi */}
          {backupFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mevcut Yedek Dosyaları</h3>
              <div className="space-y-2">
                {backupFiles.map((backup, index) => (
                  <div key={backup.filename} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{backup.filename}</p>
                      <p className="text-sm text-gray-600">
                        {backup.timestamp} • {backup.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Badge variant="secondary">En Son</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(backup.filename)}
                        disabled={isRestoring}
                      >
                        Geri Yükle
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBackup(backup.filename)}
                        disabled={isDeleting === backup.filename}
                        className="flex items-center gap-1"
                      >
                        {isDeleting === backup.filename ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        {isDeleting === backup.filename ? 'Siliniyor...' : 'Sil'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {backupFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz yedek dosyası bulunmuyor</p>
              <p className="text-sm">İlk yedeğinizi oluşturmak için yukarıdaki "Yedekle" butonunu kullanın</p>
            </div>
          )}
          </CardContent>
        </Card>
      )}

      {/* Sistem Bilgileri - Sadece yedekleme kategorisinde göster */}
      {activeCategory === 'backup' && (
        <Card>
          <CardHeader>
            <CardTitle>Sistem Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Veritabanı:</span>
                <span className="ml-2">MySQL</span>
              </div>
              <div>
                <span className="font-medium">Yedek Konumu:</span>
                <span className="ml-2">/backups</span>
              </div>
              <div>
                <span className="font-medium">Son Güncelleme:</span>
                <span className="ml-2">{new Date().toLocaleString('tr-TR')}</span>
              </div>
              <div>
                <span className="font-medium">Durum:</span>
                <Badge variant="secondary" className="ml-2">Aktif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}