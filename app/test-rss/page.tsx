// Test RSS data loading
'use client'

import React, { useState, useEffect } from 'react'
import { useEpisodes, useFeatures } from '@/app/lib/use-rss-data'

export default function TestPage() {
  const { data: episodesData, loading: episodesLoading, error: episodesError } = useEpisodes(3)
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useFeatures(2)
  
  console.log('Episodes data:', episodesData)
  console.log('Episodes loading:', episodesLoading)
  console.log('Episodes error:', episodesError)
  
  console.log('Features data:', featuresData)
  console.log('Features loading:', featuresLoading)
  console.log('Features error:', featuresError)

  return (
    <div className="min-h-screen bg-page p-8">
      <h1 className="text-3xl font-bold mb-8">RSS Data Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
        {episodesLoading && <p>Loading episodes...</p>}
        {episodesError && <p className="text-red-500">Error: {episodesError}</p>}
        {episodesData && (
          <div>
            <p>Count: {episodesData.count}</p>
            <pre>{JSON.stringify(episodesData.items, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        {featuresLoading && <p>Loading features...</p>}
        {featuresError && <p className="text-red-500">Error: {featuresError}</p>}
        {featuresData && (
          <div>
            <p>Count: {featuresData.count}</p>
            <pre>{JSON.stringify(featuresData.items, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
