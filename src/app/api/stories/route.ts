import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET fonksiyonu
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Hikayeler yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Hikayeler yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni hikaye ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // İlk kullanıcıyı bul veya oluştur
    const firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      // Eğer hiç kullanıcı yoksa bir tane oluştur
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@zentproje.com',
          name: 'Admin',
          role: 'ADMIN'
        }
      })
      
      const story = await prisma.story.create({
        data: {
          title: body.title,
          image: body.image,
          thumbnail: body.thumbnail,
          description: body.description,
          order: body.order || 0,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
          authorId: newUser.id
        },
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
      
      return NextResponse.json(story)
    }
    
    const story = await prisma.story.create({
      data: {
        title: body.title,
        image: body.image,
        thumbnail: body.thumbnail,
        description: body.description,
        order: body.order || 0,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        authorId: firstUser.id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error('Hikaye eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Hikaye eklenemedi', details: (error as Error).message },
      { status: 500 }
    )
  }
}