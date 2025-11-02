
import React from 'react';
import { CalendarEvent } from '../types';
import { CloseIcon, UsersIcon, ClockIcon } from './icons';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className={`p-4 rounded-t-lg ${event.color}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="mt-1 text-lg text-gray-900 flex items-center">
              <ClockIcon />
              <span className="ml-2">{formattedDate}</span>
            </p>
            <p className="mt-1 text-lg text-gray-900 ml-8">{event.startTime} - {event.endTime}</p>
          </div>
          {event.attendees.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Attendees</h3>
              <div className="mt-1 flex items-start">
                <UsersIcon />
                <div className="ml-2 flex flex-wrap gap-2">
                  {event.attendees.map(attendee => (
                    <span key={attendee} className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right rounded-b-lg">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;