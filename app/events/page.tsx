// Events page with refined design
"use client";

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/app/components/Cards';

// Function to fetch events from our API
async function getCalendarEvents() {
  try {
    const res = await fetch(`/api/calendar-events?type=upcoming&limit=10`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

// Function to format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
}

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample fallback data if no calendar events are available
  const fallbackEvents = [
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
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const calendarEvents = await getCalendarEvents();
        
        // Transform calendar events to match our EventCard component
        const transformedEvents = calendarEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.formattedDate ? formatDate(event.startDate) : 'TBD',
          city: event.location || 'Location TBA',
          venue: event.location || 'Venue TBA'
        }));
        
        setEvents(transformedEvents);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Use calendar events if available, otherwise use fallback
  const displayEvents = events.length > 0 ? events : fallbackEvents;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-2 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading events: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-accent-2 text-white rounded-md hover:bg-accent transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-ink mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event: any, index: number) => (
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
        
        {/* Calendar Integration Options */}
        <div className="mt-16 fade-in delay-400">
          <h2 className="text-xl font-bold text-ink mb-4 text-center">Add to Your Calendar</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.open('/api/calendar-ics', '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ICS
            </button>
            <button 
              onClick={() => window.open(`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent('c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422@group.calendar.google.com')}`, '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Google Calendar
            </button>
            <button 
              onClick={() => window.open(`webcal://calendar.google.com/calendar/ical/c_2c54e0a2af46caecc80ffb8657a18343ac7ec9af0c5f6e9b8cc6b096c7b60422%40group.calendar.google.com/public/basic.ics`, '_blank')}
              className="px-6 py-3 border border-gray-300 text-sm font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Apple Calendar
            </button>
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
  );
}