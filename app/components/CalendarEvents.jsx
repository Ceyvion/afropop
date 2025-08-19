// app/components/CalendarEvents.jsx
// Component to display events from Google Calendar

import { useState, useEffect } from 'react';

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calendar-events?type=upcoming&limit=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="calendar-events">
        <h2>Upcoming Events</h2>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-events">
        <h2>Upcoming Events</h2>
        <p>Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="calendar-events">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <span className="event-date-text">{event.formattedDate}</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                {event.location && (
                  <p className="event-location">{event.location}</p>
                )}
                {event.description && (
                  <p className="event-description">{event.description.substring(0, 150)}...</p>
                )}
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
                    View Details
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarEvents;