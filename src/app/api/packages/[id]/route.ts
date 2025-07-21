import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tek paket getir
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const servicePackage = await prisma.servicePackage.findUnique({
      where: { id: params.id }
    })
    
    if (!servicePackage) {
      return NextResponse.json(
        { error: 'Paket bulunamadı' },
        { status: 404 }
      )
    }
    
    const formattedPackage = {
      ...servicePackage,
      features: servicePackage.features ? JSON.parse(servicePackage.features) : [],
      includedExtraFeatures: servicePackage.includedExtraFeatures ? JSON.parse(servicePackage.includedExtraFeatures) : [],
      isActive: servicePackage.active,
      isPopular: servicePackage.popular
    }
    
    return NextResponse.json(formattedPackage)
  } catch (error) {
    console.error('Paket getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Paket getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Paket güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    const servicePackage = await prisma.servicePackage.update({
      where: { id: params.id },
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
    console.error('Paket güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Paket güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Paket sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.servicePackage.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Paket başarıyla silindi' })
  } catch (error) {
    console.error('Paket silinirken hata:', error)
    return NextResponse.json(
      { error: 'Paket silinemedi' },
      { status: 500 }
    )
  }
}