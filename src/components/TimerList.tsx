'use client';

import { useTimerContext } from '@/context/TimerContext';
import TimerCard from './TimerCard';

export default function TimerList() {
  const { timers } = useTimerContext();
  const timerArray = Object.values(timers);

  // Group timers by status
  const runningTimers = timerArray.filter(timer => timer.isRunning);
  const pausedTimers = timerArray.filter(timer => timer.isPaused);
  const readyTimers = timerArray.filter(timer => !timer.isRunning && !timer.isPaused && !timer.isCompleted);
  const completedTimers = timerArray.filter(timer => timer.isCompleted);

  // If no timers, show empty state
  if (timerArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 mb-4 text-lg">No timers yet. Add your first timer to get started!</p>
        <p className="text-gray-400 text-sm">Click the "Add Timer" button in the header to create a new timer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {runningTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Running</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {runningTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {pausedTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Paused</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pausedTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {readyTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Ready</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {completedTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}