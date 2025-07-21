import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Tek proje getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }
    
    // JSON string'leri array'e çevir
    const formattedProject = {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      teamMembers: project.teamMembers ? JSON.parse(project.teamMembers) : []
    }
    
    return NextResponse.json(formattedProject)
  } catch (error) {
    console.error('Proje getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Proje getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Proje güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const project = await prisma.project.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        status: body.status,
        priority: body.priority,
        client: body.client,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        budget: body.budget,
        currency: body.currency,
        tags: JSON.stringify(body.tags),
        progress: body.progress,
        teamMembers: JSON.stringify(body.teamMembers),
        featured: body.featured
      }
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Proje güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Proje güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Proje sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: {
        id: params.id
      }
    })
    
    return NextResponse.json({ message: 'Proje silindi' })
  } catch (error) {
    console.error('Proje silinirken hata:', error)
    return NextResponse.json(
      { error: 'Proje silinemedi' },
      { status: 500 }
    )
  }
}