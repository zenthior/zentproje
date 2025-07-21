const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Not: Admin kullanıcısı otomatik oluşturulmaz
  // Admin paneline erişim için manuel olarak oluşturulmalıdır
  console.log('ℹ️ Admin kullanıcısı otomatik oluşturulmayacak - manuel oluşturulmalı')

  // Paketleri oluştur
  const packages = [
    {
      name: 'Başlangıç',
      description: 'Küçük işletmeler için ideal başlangıç paketi',
      shortDescription: 'Temel web sitesi özellikleri',
      price: 2500,
      currency: 'TRY',
      category: 'web-development',
      features: JSON.stringify([
        'Responsive Tasarım',
        '5 Sayfa',
        'İletişim Formu',
        'SEO Optimizasyonu',
        '1 Yıl Hosting'
      ]),
      includedExtraFeatures: JSON.stringify(['ssl']),
      duration: '1-2 hafta',
      deliveryTime: '7-14 gün',
      maxRevisions: 3,
      popular: false,
      active: true
    },
    {
      name: 'Profesyonel',
      description: 'Orta ölçekli işletmeler için kapsamlı çözüm',
      shortDescription: 'Gelişmiş özellikler ve entegrasyonlar',
      price: 5000,
      currency: 'TRY',
      category: 'web-development',
      features: JSON.stringify([
        'Responsive Tasarım',
        '10 Sayfa',
        'İletişim Formu',
        'SEO Optimizasyonu',
        '1 Yıl Hosting',
        'Admin Paneli',
        'Blog Sistemi',
        'Sosyal Medya Entegrasyonu'
      ]),
      includedExtraFeatures: JSON.stringify(['ssl', 'blog', 'social']),
      duration: '2-3 hafta',
      deliveryTime: '14-21 gün',
      maxRevisions: 5,
      popular: true,
      active: true
    },
    {
      name: 'Kurumsal',
      description: 'Büyük şirketler için tam özellikli çözüm',
      shortDescription: 'Tüm özellikler ve özel geliştirmeler',
      price: 10000,
      currency: 'TRY',
      category: 'web-development',
      features: JSON.stringify([
        'Responsive Tasarım',
        'Sınırsız Sayfa',
        'İletişim Formu',
        'SEO Optimizasyonu',
        '1 Yıl Hosting',
        'Admin Paneli',
        'Blog Sistemi',
        'E-Ticaret Modülü',
        'Üyelik Sistemi',
        'Canlı Destek',
        'Çoklu Dil Desteği'
      ]),
      includedExtraFeatures: JSON.stringify(['ssl', 'blog', 'ecommerce', 'membership', 'chat', 'multilang']),
      duration: '3-4 hafta',
      deliveryTime: '21-28 gün',
      maxRevisions: 10,
      popular: false,
      active: true
    }
  ]

  for (const packageData of packages) {
    const existingPackage = await prisma.servicePackage.findFirst({
      where: { name: packageData.name }
    })
    
    if (!existingPackage) {
      const servicePackage = await prisma.servicePackage.create({
        data: packageData
      })
      console.log(`✅ Package created: ${servicePackage.name}`)
    } else {
      console.log(`⚠️ Package already exists: ${packageData.name}`)
    }
  }

  // Demo projeler oluştur
  const projects = [
    {
      title: 'E-Ticaret Sitesi',
      description: 'Modern ve kullanıcı dostu e-ticaret platformu',
      image: '/api/placeholder/600/400',
      status: 'completed',
      priority: 'high',
      client: 'ABC E-Ticaret Ltd.',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
      budget: 15000,
      currency: 'TRY',
      tags: JSON.stringify(['E-Ticaret', 'Next.js', 'TypeScript']),
      progress: 100,
      teamMembers: JSON.stringify(['Ahmet Yılmaz', 'Ayşe Kaya']),
      featured: true
    },
    {
      title: 'Kurumsal Web Sitesi',
      description: 'Profesyonel kurumsal web sitesi tasarımı',
      image: '/api/placeholder/600/400',
      status: 'completed',
      priority: 'medium',
      client: 'XYZ Holding A.Ş.',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-30'),
      budget: 12000,
      currency: 'TRY',
      tags: JSON.stringify(['Kurumsal', 'React', 'Node.js']),
      progress: 100,
      teamMembers: JSON.stringify(['Mehmet Demir', 'Fatma Özkan']),
      featured: true
    },
    {
      title: 'Blog Platformu',
      description: 'İçerik yönetimi ve blog sistemi',
      image: '/api/placeholder/600/400',
      status: 'in_progress',
      priority: 'low',
      client: 'Blog Yazarları Derneği',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-15'),
      budget: 8000,
      currency: 'TRY',
      tags: JSON.stringify(['Blog', 'Next.js', 'Prisma']),
      progress: 75,
      teamMembers: JSON.stringify(['Ali Veli', 'Zeynep Yıldız']),
      featured: false
    }
  ]

  for (const projectData of projects) {
    const existingProject = await prisma.project.findFirst({
      where: { title: projectData.title }
    })
    
    if (!existingProject) {
      const project = await prisma.project.create({
        data: projectData
      })
      console.log(`✅ Project created: ${project.title}`)
    } else {
      console.log(`⚠️ Project already exists: ${projectData.title}`)
    }
  }

  // Not: Demo hikayeler otomatik oluşturulmaz
  // Admin kullanıcısı olmadığı için hikayeler manuel oluşturulmalıdır
  console.log('ℹ️ Demo hikayeler otomatik oluşturulmayacak - admin kullanıcısı gerekli')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })