"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Search, Plus, Edit, Trash2, Eye, Calendar, User, Tag, DollarSign, Clock, Star } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Project {
  id: string
  title: string
  description: string
  image?: string // Yeni eklenen
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Dosya yükleme için state'ler
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '', // Yeni eklenen
    status: 'planning' as Project['status'],
    priority: 'medium' as Project['priority'],
    client: '',
    startDate: '',
    endDate: '',
    budget: 0,
    currency: 'TRY',
    tags: '',
    progress: 0,
    teamMembers: '',
    featured: false
  })

  // Projeleri API'den çek
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, priorityFilter])

  // Form sıfırlama fonksiyonu
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      status: 'planning',
      priority: 'medium',
      client: '',
      startDate: '',
      endDate: '',
      budget: 0,
      currency: 'TRY',
      tags: '',
      progress: 0,
      teamMembers: '',
      featured: false
    })
    setImageFile(null)
    setImagePreview('')
    setEditingProject(null)
    setIsModalOpen(false)
  }

  // Proje düzenleme fonksiyonu
  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '', // Yeni eklenen
      status: project.status,
      priority: project.priority,
      client: project.client,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      currency: project.currency,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : (typeof project.tags === 'string' ? project.tags : ''),
      progress: project.progress,
      teamMembers: Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : (typeof project.teamMembers === 'string' ? project.teamMembers : ''),
      featured: project.featured
    })
    setIsModalOpen(true)
  }

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

  // Dosya yükleme için fonksiyonlar
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Önizleme için FileReader kullan
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Dosya yüklenemedi')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let imageUrl = formData.image
    
    // Eğer yeni dosya seçildiyse, önce yükle
    if (imageFile) {
      setUploading(true)
      try {
        imageUrl = await uploadImage(imageFile)
      } catch (error) {
        console.error('Görsel yüklenirken hata:', error)
        alert('Görsel yüklenirken hata oluştu')
        setUploading(false)
        return
      }
      setUploading(false)
    }
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      image: imageUrl,
      status: formData.status,
      priority: formData.priority,
      client: formData.client,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      currency: formData.currency,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      progress: formData.progress,
      teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(member => member),
      featured: formData.featured
    }

    try {
      if (editingProject) {
        // Güncelleme
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        
        if (response.ok) {
          await fetchProjects() // Listeyi yenile
          resetForm()
        }
      } else {
        // Yeni ekleme
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        
        if (response.ok) {
          await fetchProjects() // Listeyi yenile
          resetForm()
        }
      }
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchProjects() // Listeyi yenile
        }
      } catch (error) {
        console.error('Proje silinirken hata:', error)
      }
    }
  }

  const toggleFeatured = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, featured: !project.featured, updatedAt: new Date().toISOString() }
        : project
    ))
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Proje Yönetimi
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Proje
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bütçe</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget, 'TRY')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="planning">Planlama</SelectItem>
                <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="on_hold">Beklemede</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Öncelik Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Öncelikler</SelectItem>
                <SelectItem value="low">Düşük</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proje Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Projeler ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Henüz proje bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Proje</th>
                    <th className="text-left p-2">Müşteri</th>
                    <th className="text-left p-2">Durum</th>
                    <th className="text-left p-2">Öncelik</th>
                    <th className="text-left p-2">İlerleme</th>
                    <th className="text-left p-2">Bütçe</th>
                    <th className="text-left p-2">Bitiş Tarihi</th>
                    <th className="text-left p-2">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {project.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          {project.client}
                        </div>
                      </td>
                      <td className="p-2">{getStatusBadge(project.status)}</td>
                      <td className="p-2">{getPriorityBadge(project.priority)}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          {formatCurrency(project.budget, project.currency)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(project.endDate)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured(project.id)}
                            className={project.featured ? 'text-yellow-600' : 'text-gray-400'}
                          >
                            <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ekleme/Düzenleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
              </h2>
              <Button variant="ghost" onClick={resetForm}>
                ×
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Proje Başlığı</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Proje Görseli</label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      
                      {/* Mevcut görsel önizlemesi */}
                      {(imagePreview || formData.image) && (
                        <div className="relative">
                          <img
                            src={imagePreview || formData.image}
                            alt="Proje görseli önizlemesi"
                            className="w-full h-48 object-contain rounded-lg border bg-gray-50 dark:bg-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview('')
                              setFormData({...formData, image: ''})
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
                      {uploading && (
                        <div className="text-sm text-blue-600">Görsel yükleniyor...</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Müşteri</label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Durum</label>
                      <Select value={formData.status} onValueChange={(value: string) => setFormData({...formData, status: value as Project['status']})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planlama</SelectItem>
                          <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                          <SelectItem value="completed">Tamamlandı</SelectItem>
                          <SelectItem value="on_hold">Beklemede</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Öncelik</label>
                      <Select value={formData.priority} onValueChange={(value: string) => setFormData({...formData, priority: value as Project['priority']})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Düşük</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="high">Yüksek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Başlangıç Tarihi</label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Bitiş Tarihi</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Açıklama</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bütçe</label>
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Para Birimi</label>
                      <Select value={formData.currency} onValueChange={(value: string) => setFormData({...formData, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">İlerleme (%)</label>
                    <Input
                      type="number"
                      value={formData.progress}
                      onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Etiketler (virgülle ayırın)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="web, tasarım, react"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Takım Üyeleri (virgülle ayırın)</label>
                    <Input
                      value={formData.teamMembers}
                      onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
                      placeholder="Ahmet Yılmaz, Ayşe Demir"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">Öne Çıkarılsın</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingProject ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Dosya seçme fonksiyonu


