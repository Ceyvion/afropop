// Program detail page with refined design
import React from 'react'
import Link from 'next/link'
import { EpisodeCard } from '@/app/components/Cards'

export default function ProgramDetail() {
  // Sample data
  const program = {
    title: 'Music & Migration',
    purpose: 'Exploring how African music evolves in diaspora communities',
    description: `
      <p>This program examines the rich musical traditions that emerge when African 
      communities settle in new lands. From Afrobeat in the UK to Caribbean influences 
      in Central America, we trace the journey of sound across borders.</p>
      
      <p>Each episode features interviews with musicians, historians, and community 
      leaders who share their experiences of cultural adaptation and preservation. 
      We explore how technology and globalization have accelerated these exchanges, 
      creating new genres and reviving old ones in unexpected places.</p>
    `,
    partners: [
      { name: 'Smithsonian Institution', logo: '' },
      { name: 'British Council', logo: '' },
    ]
  }

  const episodes = [
    { id: 1, title: 'Afrobeat in London', region: 'UK', genre: 'Afrobeat', duration: '42 min' },
    { id: 2, title: 'Reggae Roads to Central America', region: 'Central America', genre: 'Reggae', duration: '38 min' },
    { id: 3, title: 'Soukous in Paris', region: 'France', genre: 'Soukous', duration: '51 min' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/programs" className="text-accent-2 hover:text-accent transition-colors duration-200">
                Programs
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 truncate max-w-xs">
              {program.title}
            </li>
          </ol>
        </nav>
        
        {/* Hero */}
        <div className="mb-12 fade-in">
          <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl mb-8" />
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">{program.title}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl">{program.purpose}</p>
          
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary bg-accent-2 text-white hover:bg-accent">
              Follow Program
            </button>
            <button className="btn-secondary border-gray-300 text-ink bg-white hover:bg-gray-50">
              Share
            </button>
          </div>
        </div>
        
        {/* Description */}
        <div 
          className="bg-white rounded-xl p-8 mb-12 shadow-sm prose max-w-none fade-in delay-100"
          dangerouslySetInnerHTML={{ __html: program.description }}
        />
        
        {/* Partners */}
        <div className="mb-12 fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-6">Partners</h2>
          <div className="flex flex-wrap gap-8">
            {program.partners.map((partner, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded w-20 h-20" />
                <span className="ml-4 text-lg font-bold text-ink">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Associated Episodes */}
        <div className="fade-in delay-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-ink">Episodes in this Program</h2>
            <Link href="/episodes" className="text-accent-2 hover:text-accent text-sm font-bold uppercase tracking-wider transition-colors duration-200">
              View all episodes
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode, index) => (
              <div key={episode.id} className={`fade-in delay-${(index + 1) * 100}`}>
                <EpisodeCard
                  title={episode.title}
                  region={episode.region}
                  genre={episode.genre}
                  duration={episode.duration}
                  density="compact"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
