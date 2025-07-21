"use client";

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Tag, DollarSign, Clock, Users } from 'lucide-react'
import Image from 'next/image'

// Görselin köşe rengini algılayan fonksiyon
const getImageDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new HTMLImageElement()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve('#f3f4f6')
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // Kenar piksellerini daha geniş bir alanda al
      const sampleSize = 5
      const samples = []
      
      // Sol kenar
      for (let y = 0; y < Math.min(sampleSize, img.height); y++) {
        const data = ctx.getImageData(0, y, 1, 1).data
        samples.push([data[0], data[1], data[2]])
      }
      
      // Sağ kenar
      for (let y = 0; y < Math.min(sampleSize, img.height); y++) {
        const data = ctx.getImageData(img.width - 1, y, 1, 1).data
        samples.push([data[0], data[1], data[2]])
      }
      
      // Üst kenar
      for (let x = 0; x < Math.min(sampleSize, img.width); x++) {
        const data = ctx.getImageData(x, 0, 1, 1).data
        samples.push([data[0], data[1], data[2]])
      }
      
      // Alt kenar
      for (let x = 0; x < Math.min(sampleSize, img.width); x++) {
        const data = ctx.getImageData(x, img.height - 1, 1, 1).data
        samples.push([data[0], data[1], data[2]])
      }
      
      // Ortalama rengi hesapla
      let r = 0, g = 0, b = 0
      samples.forEach(sample => {
        r += sample[0]
        g += sample[1]
        b += sample[2]
      })
      
      r = Math.round(r / samples.length)
      g = Math.round(g / samples.length)
      b = Math.round(b / samples.length)
      
      resolve(`rgb(${r}, ${g}, ${b})`)
    }
    img.onerror = () => resolve('#f3f4f6')
    img.src = imageSrc
  })
}

interface Project {
  id: string
  title: string
  description: string
  image?: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high'
  client: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  tags: string[]
  progress: number
  teamMembers: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageColor, setImageColor] = useState<string>('#f3f4f6')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        } else {
          console.error('Proje bulunamadı')
        }
      } catch (error) {
        console.error('Proje yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  // Görselin dominant rengini hesapla
  useEffect(() => {
    if (project?.image) {
      getImageDominantColor(project.image)
        .then(color => setImageColor(color))
        .catch(() => setImageColor('#f3f4f6'))
    }
  }, [project?.image])

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      planning: { label: 'Planlama', variant: 'secondary' as const },
      in_progress: { label: 'Devam Ediyor', variant: 'default' as const },
      completed: { label: 'Tamamlandı', variant: 'default' as const },
      on_hold: { label: 'Beklemede', variant: 'destructive' as const }
    }
    return (
      <Badge variant={statusConfig[status].variant}>
        {statusConfig[status].label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Project['priority']) => {
    const priorityConfig = {
      low: { label: 'Düşük', variant: 'secondary' as const },
      medium: { label: 'Orta', variant: 'default' as const },
      high: { label: 'Yüksek', variant: 'destructive' as const }
    }
    return (
      <Badge variant={priorityConfig[priority].variant}>
        {priorityConfig[priority].label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Proje Bulunamadı</h1>
          <Button onClick={() => router.push('/projects')}>Projelere Dön</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Projelere Dön
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proje Görseli */}
            {project.image && (
              <Card>
                <CardContent className="p-0">
                  <div 
                    className="relative h-64 md:h-96 w-full rounded-t-lg overflow-hidden"
                    style={{
                      backgroundColor: imageColor
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-contain rounded-t-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proje Başlığı ve Açıklama */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
                  {project.featured && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      ⭐ Öne Çıkan
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(project.status)}
                  {getPriorityBadge(project.priority)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* İlerleme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Proje İlerlemesi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>İlerleme</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Etiketler */}
            {project.tags && project.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Etiketler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Proje Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>Proje Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Müşteri</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bütçe</p>
                    <p className="font-medium">{formatCurrency(project.budget, project.currency)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Başlangıç Tarihi</p>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bitiş Tarihi</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Takım Üyeleri */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Takım Üyeleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {member.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{member}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}