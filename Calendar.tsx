
import React from 'react';
import { CalendarEvent } from '../types';
import { getWeekDays, timeToMinutes } from '../utils/dateUtils';

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 18;
const HOUR_HEIGHT_REM = 4; // 4rem = 64px per hour

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const today = new Date();
  const weekDays = getWeekDays(today);
  const hours = Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_, i) => i + CALENDAR_START_HOUR);

  const calculateEventPosition = (event: CalendarEvent) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const durationMinutes = endMinutes - startMinutes;

    const calendarStartMinutes = CALENDAR_START_HOUR * 60;
    const topOffsetMinutes = startMinutes - calendarStartMinutes;
    
    if (topOffsetMinutes < 0) return null; // Event starts before calendar view

    const top = (topOffsetMinutes / 60) * HOUR_HEIGHT_REM;
    const height = (durationMinutes / 60) * HOUR_HEIGHT_REM;

    return { top: `${top}rem`, height: `${height}rem` };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-2 text-center border-b border-gray-200">
            <p className="text-sm text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className={`text-lg font-semibold ${day.toDateString() === today.toDateString() ? 'text-blue-600' : ''}`}>
              {day.getDate()}
            </p>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-7 h-[50rem] divide-x divide-gray-200">
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="col-span-7 border-b border-gray-100 absolute w-full" style={{ top: `${(hour - CALENDAR_START_HOUR + 1) * HOUR_HEIGHT_REM}rem` }}>
              <span className="text-xs text-gray-400 absolute -top-2 left-2">{`${hour}:00`}</span>
            </div>
          </React.Fragment>
        ))}

        {weekDays.map((day, dayIndex) => (
          <div key={day.toISOString()} className="relative">
            {events
              .filter(e => e.date === day.toISOString().split('T')[0])
              .map(event => {
                const position = calculateEventPosition(event);
                if (!position) return null;
                return (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 p-2 rounded-lg text-white text-xs cursor-pointer overflow-hidden ${event.color} transition-all duration-200 hover:opacity-80`}
                    style={{ ...position }}
                    onClick={() => onEventClick(event)}
                  >
                    <p className="font-bold truncate">{event.title}</p>
                    <p className="truncate">{event.startTime} - {event.endTime}</p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;