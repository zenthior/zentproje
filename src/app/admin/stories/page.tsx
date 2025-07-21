"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Clock, Upload, X } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Story {
  id: string
  title?: string
  image: string
  thumbnail?: string
  description?: string
  active: boolean
  viewCount: number
  order: number
  expiresAt?: string
  createdAt: string
  author: {
    name?: string
    email: string
  }
}

export default function StoriesAdmin() {
  const [stories, setStories] = useState<Story[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    thumbnail: '',
    description: '',
    order: 0,
    expiresAt: ''
  })
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('')
  
  // Onay modalı için state'ler
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Hikayeler yüklenirken hata:', error)
    }
  }

  const handleFileUpload = async (file: File, type: 'image' | 'thumbnail') => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'image') {
          setFormData(prev => ({ ...prev, image: data.url }))
          setPreviewImage(data.url)
        } else {
          setFormData(prev => ({ ...prev, thumbnail: data.url }))
          setPreviewThumbnail(data.url)
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Dosya yüklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error)
      alert('Dosya yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image) {
      alert('Ana görsel zorunludur')
      return
    }
    
    try {
      const url = editingStory ? `/api/stories/${editingStory.id}` : '/api/stories'
      const method = editingStory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchStories()
        setIsModalOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Hikaye kaydedilirken hata oluştu')
      }
    } catch (error) {
      console.error('Hikaye kaydedilirken hata:', error)
      alert('Hikaye kaydedilirken hata oluştu')
    }
  }

  const handleDelete = async (id: string, title?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hikayeyi Sil',
      message: `"${title || 'Bu hikaye'}" kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/stories/${id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            fetchStories()
          }
        } catch (error) {
          console.error('Hikaye silinirken hata:', error)
        }
      }
    })
  }

  const handleEdit = (story: Story) => {
    setEditingStory(story)
    setFormData({
      title: story.title || '',
      image: story.image,
      thumbnail: story.thumbnail || '',
      description: story.description || '',
      order: story.order,
      expiresAt: story.expiresAt ? story.expiresAt.split('T')[0] : ''
    })
    setPreviewImage(story.image)
    setPreviewThumbnail(story.thumbnail || '')
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      thumbnail: '',
      description: '',
      order: 0,
      expiresAt: ''
    })
    setPreviewImage('')
    setPreviewThumbnail('')
    setEditingStory(null)
  }

  const removeImage = (type: 'image' | 'thumbnail') => {
    if (type === 'image') {
      setFormData(prev => ({ ...prev, image: '' }))
      setPreviewImage('')
    } else {
      setFormData(prev => ({ ...prev, thumbnail: '' }))
      setPreviewThumbnail('')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hikayeler Yönetimi</h1>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Hikaye
        </button>
      </div>

      {/* Hikayeler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[9/16] bg-gray-200 relative">
              {story.image && (
                <img
                  src={story.image}
                  alt={story.title || 'Hikaye'}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Eye size={12} />
                {story.viewCount}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">{story.title || 'Başlıksız'}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {story.description || 'Açıklama yok'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Sıra: {story.order}</span>
                {story.expiresAt && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(story.expiresAt).toLocaleDateString('tr-TR')}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(story)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={14} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(story.id, story.title)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 size={14} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Onay Modalı */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />

      {/* Mevcut Modal - Hikaye Ekleme/Düzenleme */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingStory ? 'Hikaye Düzenle' : 'Yeni Hikaye'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Hikaye başlığı"
                />
              </div>
              
              {/* Ana Görsel Yükleme */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Ana Görsel *</label>
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Önizleme"
                      className="w-full h-32 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('image')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'image')
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {uploading ? 'Yükleniyor...' : 'Ana görsel seçin'}
                      </span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Küçük Görsel Yükleme */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Küçük Görsel (Thumbnail)</label>
                {previewThumbnail ? (
                  <div className="relative">
                    <img
                      src={previewThumbnail}
                      alt="Thumbnail Önizleme"
                      className="w-full h-32 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('thumbnail')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'thumbnail')
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {uploading ? 'Yükleniyor...' : 'Küçük görsel seçin (opsiyonel)'}
                      </span>
                    </label>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Hikaye açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Sıra</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Son Kullanma Tarihi</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploading || !formData.image}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Yükleniyor...' : (editingStory ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}