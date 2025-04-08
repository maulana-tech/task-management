'use client';

import { useState } from 'react';
import { TimerConfig } from '@/types';
import { useTimerContext } from '@/context/TimerContext';
import Timer from './Timer';
import TimerForm from './TimerForm';

interface TimerCardProps {
  timer: TimerConfig;
}

export default function TimerCard({ timer }: TimerCardProps) {
  const { updateTimer, deleteTimer, updateTimerStatus } = useTimerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get timer status for display
  const getTimerStatus = (): string => {
    if (timer.isCompleted) return 'Completed';
    if (timer.isRunning) return 'Running';
    if (timer.isPaused) return 'Paused';
    return 'Ready';
  };

  // Handler for timer update
  const handleTimerUpdate = (timerData: Partial<TimerConfig>) => {
    updateTimerStatus(timer.id, timerData);
  };

  // Handler for edit timer
  const handleEditSubmit = (updatedTimerData: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateTimer({
      id: timer.id,
      ...updatedTimerData,
    });
    setIsEditing(false);
  };

  // Handler for delete timer
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this timer?')) {
      deleteTimer(timer.id);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If in edit mode, show form
  if (isEditing) {
    return (
      <div className="p-2">
        <TimerForm
          timer={timer}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = (timer.totalDurationInSeconds - timer.timeRemaining) / timer.totalDurationInSeconds * 100;

  return (
    <>
      {isFullscreen && (
        <Timer
          timer={timer}
          onTimerUpdate={handleTimerUpdate}
          fullscreen={true}
          onExitFullscreen={() => setIsFullscreen(false)}
        />
      )}
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg truncate text-gray-800 dark:text-gray-200">{timer.name}</h3>
          <div className="flex gap-1">
            <button
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
              title="Focus Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 mb-3 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gray-500 dark:bg-gray-400"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Duration: {timer.duration.minutes}m {timer.duration.seconds}s
          </div>
          
          <div className={`text-sm px-2 py-1 rounded ${
            timer.isRunning ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
            timer.isPaused ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
            timer.isCompleted ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
            'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {getTimerStatus()}
          </div>
        </div>
        
        <div className="mt-3">
          <Timer
            timer={timer}
            onTimerUpdate={handleTimerUpdate}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}