// Events page with refined design
import React from 'react'
import { EventCard } from '@/app/components/Cards'

export default function Events() {
  // Sample event data
  const events = [
    { 
      id: 1, 
      title: 'Afropop Live: Brooklyn', 
      date: 'Jun 15', 
      city: 'New York', 
      venue: 'Brooklyn Museum' 
    },
    { 
      id: 2, 
      title: 'Festival Spotlight: Felabration', 
      date: 'Oct 8-10', 
      city: 'Lagos', 
      venue: 'Newark Museum' 
    },
    { 
      id: 3, 
      title: 'Highlife Heritage Night', 
      date: 'Jul 22', 
      city: 'Accra', 
      venue: 'National Theatre' 
    },
    { 
      id: 4, 
      title: 'Amapiano Workshop & Dance', 
      date: 'Aug 5', 
      city: 'Johannesburg', 
      venue: 'Carnival City' 
    },
    { 
      id: 5, 
      title: 'Soukous Legends Reunion', 
      date: 'Sep 12', 
      city: 'Paris', 
      venue: 'Le Trabendo' 
    },
    { 
      id: 6, 
      title: 'Taarab Poetry & Music', 
      date: 'Nov 3', 
      city: 'Zanzibar', 
      venue: 'Stone Town Cultural Centre' 
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Join us for live performances, workshops, and cultural celebrations around the world.
          </p>
        </div>
        
        {/* Month Strip */}
        <div className="mb-10 fade-in delay-100">
          <h2 className="text-xl font-bold text-ink mb-4">Upcoming Events</h2>
          <div className="flex overflow-x-auto pb-4">
            {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
              <button
                key={month}
                className={`px-5 py-2.5 text-sm font-bold whitespace-nowrap mr-2 rounded-full transition-colors duration-200 ${
                  month === 'Jun'
                    ? 'bg-accent-2 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {month} 2025
              </button>
            ))}
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="mb-12 fade-in delay-200">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-xs font-bold text-gray-500 py-2 text-center uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Calendar days would be rendered here */}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3; // Offset to start on Wednesday
              const isCurrentMonth = day > 0 && day <= 30;
              const isToday = day === 15; // Highlight today
              const hasEvent = day === 15 || day === 22; // Mark days with events
              
              return (
                <div
                  key={i}
                  className={`h-12 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    isCurrentMonth 
                      ? isToday 
                        ? 'bg-accent-2 text-white font-bold' 
                        : hasEvent 
                          ? 'bg-accent-50 text-accent-2 font-bold hover:bg-accent-100 cursor-pointer' 
                          : 'text-ink hover:bg-gray-100 cursor-pointer'
                      : 'text-gray-300'
                  }`}
                >
                  {isCurrentMonth ? day : ''}
                  {hasEvent && !isToday && (
                    <span className="absolute w-1.5 h-1.5 bg-accent-2 rounded-full bottom-1"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Events List */}
        <div className="fade-in delay-300">
          <h2 className="text-2xl font-bold text-ink mb-6">June 2025 Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={event.id} className={`fade-in delay-${(index + 1) * 100}`}>
                <EventCard
                  title={event.title}
                  date={event.date}
                  city={event.city}
                  venue={event.venue}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Load More */}
        <div className="mt-16 text-center fade-in delay-400">
          <button className="px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider">
            View All Events
          </button>
        </div>
      </div>
    </div>
  )
}