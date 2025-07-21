"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Github, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

// Project tipini tanımla
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  tags: string[];
  progress: number;
  teamMembers: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Görselin köşe rengini algılayan fonksiyon
const getImageDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new HTMLImageElement()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve('#e2e8f0')
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
    img.onerror = () => resolve('#e2e8f0')
    img.src = imageSrc
  })
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [imageColors, setImageColors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Tüm projeleri API'den çek
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
          setDataLoaded(true)
        }
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error)
        setDataLoaded(true)
      }
    }

    // Minimum 1.5 saniye loading göster
    const minLoadingTime = setTimeout(() => {
      setLoading(false)
    }, 1500)

    fetchProjects()

    return () => clearTimeout(minLoadingTime)
  }, [])

  // Görsellerin dominant renklerini hesapla
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(async (project) => {
        if (project.image && !imageColors[project.id]) {
          try {
            const color = await getImageDominantColor(project.image)
            setImageColors(prev => ({ ...prev, [project.id]: color }))
          } catch (error) {
            console.error('Renk hesaplama hatası:', error)
            setImageColors(prev => ({ ...prev, [project.id]: '#e2e8f0' }))
          }
        }
      })
    }
  }, [projects, imageColors])

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      planning: { label: 'Planlama', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
      on_hold: { label: 'Beklemede', color: 'bg-red-100 text-red-800' }
    }
    return (
      <span className={`text-xs px-2 py-1 rounded ${statusConfig[status].color}`}>
        {statusConfig[status].label}
      </span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Modern Navigation */}
      <div className="fixed top-6 left-6 z-50 flex gap-3">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 dark:border-slate-700/20 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
          >
            <Home size={18} />
            <span className="font-medium">Ana Sayfa</span>
          </motion.button>
        </Link>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 backdrop-blur-md rounded-full shadow-lg text-white border border-blue-400/30"
        >
          <span className="font-medium">Projeler</span>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projelerim
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Gerçekleştirdiğim web projeleri ve uygulamalar
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Projeler yükleniyor...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">Henüz proje eklenmemiş.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Admin panelinden proje ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Proje Görseli */}
                  <div 
                    className="h-48 relative overflow-hidden"
                    style={{
                      backgroundColor: imageColors[project.id] || '#e2e8f0'
                    }}
                  >
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <span className="text-4xl">📁</span>
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          ⭐ Öne Çıkan
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar size={16} />
                        <span>Müşteri: {project.client}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>💰 {formatCurrency(project.budget, project.currency)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>📅 {formatDate(project.endDate)}</span>
                      </div>
                    </div>
                    
                    {/* İlerleme Çubuğu */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">İlerleme</span>
                        <span className="text-slate-600 dark:text-slate-300">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Etiketler */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags && project.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags && project.tags.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{project.tags.length - 3} daha
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}