import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET fonksiyonu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Hikayeyi bul ve görüntülenme sayısını artır
    const story = await prisma.story.update({
      where: { id: params.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error('Hikaye yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Hikaye bulunamadı' },
      { status: 404 }
    )
  }
}

// Hikaye güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const story = await prisma.story.update({
      where: { id: params.id },
      data: {
        title: body.title,
        image: body.image,
        thumbnail: body.thumbnail,
        description: body.description,
        active: body.active,
        order: body.order,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
      }
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error('Hikaye güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Hikaye güncellenemedi' },
      { status: 500 }
    )
  }
}

// Hikaye sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.story.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Hikaye silindi' })
  } catch (error) {
    console.error('Hikaye silinirken hata:', error)
    return NextResponse.json(
      { error: 'Hikaye silinemedi' },
      { status: 500 }
    )
  }
}

// PUT ve DELETE fonksiyonları zaten doğru