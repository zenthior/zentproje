import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm paketleri getir
export async function GET() {
  try {
    const packages = await prisma.servicePackage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // JSON string'leri array'e çevir
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : [],
      includedExtraFeatures: pkg.includedExtraFeatures ? JSON.parse(pkg.includedExtraFeatures) : [],
      isActive: pkg.active,
      isPopular: pkg.popular
    }))
    
    return NextResponse.json(formattedPackages)
  } catch (error) {
    console.error('Paketler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Paketler getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni paket oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const servicePackage = await prisma.servicePackage.create({
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price,
        currency: body.currency || 'USD',
        duration: body.duration,
        category: body.category,
        features: JSON.stringify(body.features || []),
        includedExtraFeatures: JSON.stringify(body.includedExtraFeatures || []),
        deliveryTime: body.deliveryTime,
        maxRevisions: body.maxRevisions || 3,
        popular: body.isPopular || false,
        active: body.isActive !== undefined ? body.isActive : true
      }
    })
    
    const formattedPackage = {
      ...servicePackage,
      features: servicePackage.features ? JSON.parse(servicePackage.features) : [],
      includedExtraFeatures: servicePackage.includedExtraFeatures ? JSON.parse(servicePackage.includedExtraFeatures) : [],
      isActive: servicePackage.active,
      isPopular: servicePackage.popular
    }
    
    return NextResponse.json(formattedPackage)
  } catch (error) {
    console.error('Paket oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Paket oluşturulamadı' },
      { status: 500 }
    )
  }
}

// PUT - Paket güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const servicePackage = await prisma.servicePackage.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        features: JSON.stringify(updateData.features),
        duration: updateData.duration,
        popular: updateData.popular || false,
        active: updateData.active !== undefined ? updateData.active : true
      }
    })
    
    return NextResponse.json(servicePackage)
  } catch (error) {
    console.error('Paket güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Paket güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Paket sil
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    await prisma.servicePackage.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Paket silindi' })
  } catch (error) {
    console.error('Paket silinirken hata:', error)
    return NextResponse.json(
      { error: 'Paket silinemedi' },
      { status: 500 }
    )
  }
}