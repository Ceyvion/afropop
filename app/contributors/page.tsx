// Hosts & Contributors page with refined design
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getStaggeredDelayClass } from '@/app/lib/animation-utils'

export default function Contributors() {
  const [activeTab, setActiveTab] = useState('people')

  // Sample data
  const people = [
    { id: 1, name: 'Amina Okello', role: 'Host', bio: 'Amina is a renowned musicologist specializing in East African genres.', episodes: 42 },
    { id: 2, name: 'Kofi Asante', role: 'Producer', bio: 'Kofi has produced over 200 episodes and features on African music.', episodes: 210 },
    { id: 3, name: 'Sade Johnson', role: 'Editor', bio: 'Sade brings a decade of experience in music journalism to the team.', episodes: 15 },
    { id: 4, name: 'Juma Hassan', role: 'Correspondent', bio: 'Juma reports on emerging music scenes across East Africa.', episodes: 38 },
    { id: 5, name: 'Maria Santos', role: 'Sound Engineer', bio: 'Maria crafts the signature sound of Afropop Worldwide.', episodes: 180 },
    { id: 6, name: 'Olumide Adeyemi', role: 'Researcher', bio: 'Olumide provides deep cultural context for our stories.', episodes: 25 },
  ]

  const shows = [
    { id: 1, name: 'Music & Migration', host: 'Amina Okello', episodes: 12 },
    { id: 2, name: 'Women in Music', host: 'Sade Johnson', episodes: 8 },
    { id: 3, name: 'Urban Soundscapes', host: 'Kofi Asante', episodes: 15 },
    { id: 4, name: 'Heritage & Preservation', host: 'Juma Hassan', episodes: 10 },
  ]

  return (
    <div className="min-h-screen bg-page text-white">
      <div className="page-shell py-12">
        <div className="mb-12 fade-in space-y-4">
          <p className="page-kicker">People</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Hosts & contributors keeping Afropop on air.</h1>
          <p className="text-lg text-white/60 max-w-3xl">
            The voices, editors, and producers behind Afropop Worldwide.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-white/10 mb-12 fade-in delay-100">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'people'
                  ? 'border-accent-v text-white'
                  : 'border-transparent text-white/50 hover:text-white hover:border-white/20'
              }`}
              onClick={() => setActiveTab('people')}
            >
              People
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'shows'
                  ? 'border-accent-v text-white'
                  : 'border-transparent text-white/50 hover:text-white hover:border-white/20'
              }`}
              onClick={() => setActiveTab('shows')}
            >
              Shows
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'people' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in delay-200">
            {people.map((person, index) => (
              <div
                key={person.id}
                className={`rounded-[28px] border border-white/10 bg-elevated text-white shadow-[0_25px_40px_rgba(0,0,0,0.4)] overflow-hidden card-hover fade-in ${getStaggeredDelayClass(index, 100)}`}
              >
                <div className="bg-white/5 border-b border-white/5 aspect-square w-full" />
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{person.name}</h3>
                      <p className="text-accent-v uppercase tracking-[0.35em] text-xs mt-1">{person.role}</p>
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60 bg-white/5 px-3 py-1 rounded-full">
                      {person.episodes} episodes
                    </span>
                  </div>
                  <p className="text-white/70">{person.bio}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <Link href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </Link>
                      <Link href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </Link>
                    </div>
                    <button className="text-xs uppercase tracking-[0.35em] text-accent-v hover:text-white transition">
                      View Episodes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'shows' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in delay-200">
            {shows.map((show, index) => (
              <div
                key={show.id}
                className={`rounded-[28px] border border-white/10 bg-elevated text-white shadow-[0_25px_40px_rgba(0,0,0,0.4)] overflow-hidden card-hover fade-in ${getStaggeredDelayClass(index, 100)}`}
              >
                <div className="bg-white/5 border-b border-white/5 aspect-video w-full" />
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{show.name}</h3>
                  <p className="text-white/60">Hosted by {show.host}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60 bg-white/5 px-3 py-1 rounded-full">
                      {show.episodes} episodes
                    </span>
                    <button className="text-xs uppercase tracking-[0.35em] text-accent-v hover:text-white transition">
                      View Episodes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
