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
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">No timers yet. Add your first timer to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {runningTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Running</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {runningTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {pausedTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Paused</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pausedTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {readyTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Ready</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyTimers.map(timer => (
              <TimerCard key={timer.id} timer={timer} />
            ))}
          </div>
        </div>
      )}
      
      {completedTimers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Completed</h2>
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