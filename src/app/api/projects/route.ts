import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Tüm projeleri getir
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // JSON string'leri array'e çevir
    const formattedProjects = projects.map(project => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      teamMembers: project.teamMembers ? JSON.parse(project.teamMembers) : []
    }))
    
    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error('Projeler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Projeler getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni proje ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image, // Yeni eklenen
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
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Proje eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Proje eklenemedi' },
      { status: 500 }
    )
  }
}