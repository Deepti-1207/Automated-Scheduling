
import React, { useState } from 'react';
import { CalendarEvent } from './types';
import Calendar from './components/Calendar';
import SchedulerInput from './components/SchedulerInput';
import EventModal from './components/EventModal';
import { getSchedulingFunctionCall } from './services/geminiService';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Project Kickoff',
      date: new Date().toISOString().split('T')[0], // Today
      startTime: '10:00',
      endTime: '11:30',
      attendees: ['Alice', 'Bob'],
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: 'Design Review',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
      startTime: '14:00',
      endTime: '15:00',
      attendees: ['Charlie', 'Dana'],
      color: 'bg-green-500',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleScheduleRequest = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getSchedulingFunctionCall(prompt);
      if (result && result.name === 'scheduleEvent') {
        const args = result.args;
        
        // Basic validation
        if (!args.title || !args.date || !args.startTime || !args.endTime) {
            throw new Error("I couldn't figure out all the event details. Please provide a title, date, start time, and end time.");
        }

        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          // FIX: The properties on `result.args` are of type 'any'. Explicitly cast them to the types defined in the `CalendarEvent` interface to resolve TypeScript errors.
          title: args.title as string,
          date: args.date as string,
          startTime: args.startTime as string,
          endTime: args.endTime as string,
          attendees: (args.attendees as string[]) || [],
          color: ['bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 5)],
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
      } else {
        setError("I wasn't able to schedule an event from your request. Please try rephrasing it, for example: 'Schedule a meeting with John for tomorrow at 2 PM about the project launch.'");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to schedule event: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">Automated Scheduling Assistant</h1>
          <p className="text-gray-500 mt-1">Powered by Gemini API</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <SchedulerInput onSubmit={handleScheduleRequest} isLoading={isLoading} />
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
        </div>
        <div className="mt-8">
          <Calendar events={events} onEventClick={handleEventClick} />
        </div>
      </main>
      {selectedEvent && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;