// Transcript component based on the spec
'use client'

import React, { useState } from 'react'

interface TranscriptProps {
  content: string // In a real implementation, this would be structured cue data
}

const Transcript: React.FC<TranscriptProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // In a real implementation, we would parse WebVTT cues and render them with time-sync functionality
  // For now, we'll just show a collapsible text area

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-ink font-body">Transcript</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-accent-v hover:opacity-90 font-medium font-body"
        >
          {isExpanded ? 'Show Less' : 'Show Full Transcript'}
        </button>
      </div>
      
      <div className={`prose max-w-none text-sm ${isExpanded ? '' : 'line-clamp-6'}`}>
        {content || 'Transcript content would appear here...'}
      </div>
    </div>
  )
}

export default Transcript
