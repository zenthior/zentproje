"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Palette, Zap, Star, Users, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Link from 'next/link'
import Header from "@/components/Header";
import StoriesSection from '@/components/StoriesSection'
import Image from 'next/image'

// Project arayüzü tanımı - image alanı eklendi
interface Project {
  id: string;
  title: string;
  category?: string;
  tags: string[];
  description?: string;
  image?: string; // Görsel alanı eklendi
  createdAt?: string;
  liveUrl?: string;
  githubUrl?: string;
}

// Mock verileri kaldırıldı - admin panelinden çekilecek
const services = [
  {
    icon: Code,
    title: "Web Geliştirme",
    description: "Modern teknolojilerle hızlı ve güvenli web uygulamaları"
  },
  {
    icon: Palette,
    title: "UI/UX Tasarım",
    description: "Kullanıcı dostu ve etkileyici arayüz tasarımları"
  },
  {
    icon: Zap,
    title: "Performans Optimizasyonu",
    description: "Hızlı yüklenen ve SEO uyumlu web siteleri"
  }
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    happyClients: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Projeleri API'den çek
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          // Sadece öne çıkarılan projeleri göster
          setProjects(data.slice(0, 6)) // 6 proje göster
        }
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error)
      }
    }

    // Rastgele istatistikleri ayarla
    setStats({
      totalProjects: Math.floor(Math.random() * 50) + 150, // 150-199 arası
      happyClients: Math.floor(Math.random() * 30) + 80,   // 80-109 arası
      satisfaction: Math.floor(Math.random() * 5) + 95     // 95-99 arası
    });

    fetchProjects()
  }, [])

  useEffect(() => {
    // Admin panelinden projeler çek
    // TODO: API endpoint oluşturulacak
    // fetchProjects();
    // fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Hikayeler Bölümü - Header'dan sonra */}
      <StoriesSection />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
        >
          Modern Web
          <br />
          Çözümleri
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
        >
          Profesyonel web tasarım ve geliştirme hizmetleri ile işinizi dijital dünyada öne çıkarın.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/packages" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-colors flex items-center gap-2 justify-center">
            Paketleri İncele
            <ArrowRight size={20} />
          </Link>
          <Link href="/projects" className="border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-4 rounded-full font-semibold transition-colors">
            Projelerime Göz At
          </Link>
        </motion.div>
      </section>

      {/* Stats - Admin panelinden çekilecek */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          >
            <Trophy className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.totalProjects}+
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Tamamlanan Proje
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          >
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.happyClients}+
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Mutlu Müşteri
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          >
            <Star className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.satisfaction}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Müşteri Memnuniyeti
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects - Admin panelinden çekilecek */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white"
        >
          Son Projelerim
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 dark:text-slate-300">Henüz proje eklenmemiş.</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Admin panelinden proje ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            projects.slice(0, 6).map((project, index) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        {/* Proje görseli */}
                        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3 overflow-hidden relative">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                              <Code className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          {project.category || 'Web Projesi'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.tags) && project.tags.slice(0, 2).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
        {projects.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/projects" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Tüm Projeleri Gör
            </Link>
          </div>
        )}
      </section>

      {/* Services */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white"
        >
          Hizmetlerim
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <service.icon className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ZentProje
          </div>
          <p className="text-slate-400 mb-6">
            Modern web çözümleri ile işinizi dijital dünyada öne çıkarın.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/contact" className="hover:text-blue-400 transition-colors">İletişim</Link>
            <Link href="/projects" className="hover:text-blue-400 transition-colors">Projeler</Link>
            <Link href="/about" className="hover:text-blue-400 transition-colors">Hakkımda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
