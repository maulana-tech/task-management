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
  const [showTimer, setShowTimer] = useState(true);

  // Format time remaining to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg truncate">{timer.name}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Duration: {timer.duration.minutes}m {timer.duration.seconds}s
        </div>
        
        <div className={`text-sm px-2 py-1 rounded ${
          timer.isRunning ? 'bg-green-100 text-green-800' : 
          timer.isPaused ? 'bg-yellow-100 text-yellow-800' : 
          timer.isCompleted ? 'bg-gray-100 text-gray-800' : 
          'bg-blue-100 text-blue-800'
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
  );
}