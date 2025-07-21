"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Story {
  id: string
  title?: string
  image: string
  thumbnail?: string
  description?: string
  viewCount: number
  author: {
    name?: string
  }
}

export default function StoriesSection() {
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const openStory = async (story: Story, index: number) => {
    setSelectedStory(story)
    setCurrentIndex(index)
    
    // Görüntülenme sayısını artır
    try {
      await fetch(`/api/stories/${story.id}`, { method: 'GET' })
    } catch (error) {
      console.error('Görüntülenme sayısı güncellenirken hata:', error)
    }
  }

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setSelectedStory(stories[nextIndex])
    }
  }

  const prevStory = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setSelectedStory(stories[prevIndex])
    }
  }

  if (stories.length === 0) return null

  return (
    <>
      {/* Hikayeler Bölümü */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => openStory(story, index)}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img
                    src={story.thumbnail || story.image}
                    alt={story.title || 'Hikaye'}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-2 max-w-[80px] truncate">
                {story.title || 'Hikaye'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hikaye Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Hikaye İçeriği */}
          <div className="relative w-full max-w-sm h-full max-h-[80vh] bg-black rounded-lg overflow-hidden">
            <img
              src={selectedStory.image}
              alt={selectedStory.title || 'Hikaye'}
              className="w-full h-full object-cover"
            />
            
            {/* Üst Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5">
                    <img
                      src={selectedStory.thumbnail || selectedStory.image}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {selectedStory.title || 'Hikaye'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-white hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex gap-1 mt-3">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className={`h-0.5 flex-1 rounded ${
                      index === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Alt Bilgi */}
            {selectedStory.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <p className="text-white text-sm">{selectedStory.description}</p>
              </div>
            )}
            
            {/* Navigasyon */}
            <button
              onClick={prevStory}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextStory}
              disabled={currentIndex === stories.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-30"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}