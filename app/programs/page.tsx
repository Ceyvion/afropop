// Programs page with refined design
import React from 'react'
import { ProgramCard } from '@/app/components/Cards'
import { getStaggeredDelayClass } from '@/app/lib/animation-utils'

export default function Programs() {
  // Sample program data
  const programs = [
    { 
      id: 1, 
      title: 'Music & Migration', 
      purpose: 'Exploring how African music evolves in diaspora communities' 
    },
    { 
      id: 2, 
      title: 'Women in Music', 
      purpose: 'Celebrating female artists and their contributions to African music' 
    },
    { 
      id: 3, 
      title: 'Urban Soundscapes', 
      purpose: 'Examining the rise of contemporary genres in major African cities' 
    },
    { 
      id: 4, 
      title: 'Heritage & Preservation', 
      purpose: 'Documenting traditional music and instruments at risk of being lost' 
    },
  ]

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Programs</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            In-depth series exploring themes in African music and culture
          </p>
        </div>
        
        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in delay-100">
          {programs.map((program, index) => (
            <div key={program.id} className={`fade-in ${getStaggeredDelayClass(index, 100)}`}>
              <ProgramCard
                title={program.title}
                purpose={program.purpose}
              />
            </div>
          ))}
        </div>
        
        {/* Featured Program */}
        <div className="mt-20 fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-6">Featured Program</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed aspect-video w-full" />
              <div className="absolute top-6 left-6 bg-accent-v text-white text-sm font-bold px-4 py-1 rounded-full">
                NEW SERIES
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-ink mb-4">Afropop Special: The Afrobeat Generation</h3>
              <p className="text-gray-600 mb-6">
                A four-part series exploring how the children of Afrobeat legends are 
                carrying forward their fathers’ musical and political legacies while 
                forging their own paths in contemporary music.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-accent">View Episodes</button>
                <button className="btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
