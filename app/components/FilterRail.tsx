// Filter component with refined design
'use client'

import React, { useState, useEffect, useRef } from 'react'

type FiltersMap = Record<string, string[]>

interface FilterRailProps {
  onChange?: (filters: FiltersMap) => void
  onApply?: (filters: FiltersMap) => void
  initialSelected?: FiltersMap
}

const FilterRail = ({ onChange, onApply, initialSelected }: FilterRailProps) => {
  // Facets from the spec
  const facets = [
    { name: 'Region', options: ['West Africa', 'East Africa', 'Southern Africa', 'North Africa'] },
    { name: 'Country', options: ['Nigeria', 'Ghana', 'Senegal', 'South Africa', 'Kenya', 'Egypt'] },
    { name: 'Genre', options: ['Afrobeats', 'Highlife', 'Soukous', 'Gqom', 'Amapiano', 'Taarab'] },
    { name: 'Era/Decade', options: ['2020s', '2010s', '2000s', '1990s', '1980s'] },
    { name: 'Mood', options: ['Upbeat', 'Relaxed', 'Spiritual', 'Political', 'Romantic'] },
    { name: 'Host', options: ['Kofi', 'Amina', 'Juma', 'Sade'] },
    { name: 'Length', options: ['< 30 min', '30-60 min', '> 60 min'] },
    { name: 'Tags', options: ['Interview', 'Live', 'Festival', 'History', 'Dance'] },
  ]

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<FiltersMap>(initialSelected || {})

  useEffect(() => {
    if (initialSelected) setSelectedFilters(initialSelected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialSelected)])

  const handleFilterChange = (facetName: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[facetName] || []
      const updated = current.includes(option)
        ? current.filter(item => item !== option)
        : [...current, option]
      return { ...prev, [facetName]: updated }
    })
  }

  // Notify parent after state commits to avoid setState during render of child
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      onChange?.(selectedFilters)
    } else {
      didMount.current = true
    }
    // We intentionally do not include onChange in deps to avoid effect recreation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters])

  const isOptionSelected = (facetName: string, option: string) => {
    return selectedFilters[facetName]?.includes(option) || false
  }

  return (
    <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 pr-6 border-r border-gray-200">
      {/* Stick the whole rail below the header */}
      <div className="sticky top-20">
        <h2 className="text-xl font-bold text-ink mb-4">Filters</h2>

        {/* Scrollable facet list with its own scrollbar */}
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 custom-scroll space-y-8">
          {facets.map((facet) => (
            <div key={facet.name}>
              <h3 className="text-xs font-bold text-ink mb-3 uppercase tracking-wider">{facet.name}</h3>
              <div className="space-y-2.5">
                {facet.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`${facet.name}-${option}`}
                      type="checkbox"
                      checked={isOptionSelected(facet.name, option)}
                      onChange={() => handleFilterChange(facet.name, option)}
                      className="h-4 w-4 text-accent-2 border-gray-300 rounded focus:ring-accent-2 transition-colors duration-200"
                    />
                    <label
                      htmlFor={`${facet.name}-${option}`}
                      className="ml-3 text-sm text-gray-700 hover:text-ink transition-colors duration-200 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Spacer so the bottom button never overlaps last options */}
          <div className="h-6" />
        </div>

        {/* Tasteful apply area pinned at bottom of the rail */}
        <div className="mt-3 pt-3 border-t border-gray-200 bg-white/90">
          <button
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-accent-2 hover:bg-accent transition-colors duration-200 shadow-sm"
            onClick={() => onApply?.(selectedFilters)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterRail
