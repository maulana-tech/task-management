'use client';

import { useState, useEffect } from 'react';
import { TimerConfig } from '@/types';

interface TimerFormProps {
  timer?: TimerConfig; // If provided, edit mode
  onSubmit: (timerData: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Default values for form
const defaultFormValues = {
  name: '',
  duration: {
    minutes: 25,
    seconds: 0,
  },
  totalDurationInSeconds: 25 * 60,
  cycles: 1,
  currentCycle: 1,
  timeRemaining: 25 * 60, // in seconds
  isRunning: false,
  isPaused: false,
  isCompleted: false,
};

export default function TimerForm({ timer, onSubmit, onCancel }: TimerFormProps) {
  // State for form
  const [formValues, setFormValues] = useState(defaultFormValues);
  
  // If timer is provided (edit mode), fill form with timer data
  useEffect(() => {
    if (timer) {
      setFormValues({
        name: timer.name,
        duration: { ...timer.duration },
        totalDurationInSeconds: timer.totalDurationInSeconds,
        cycles: timer.cycles,
        currentCycle: timer.currentCycle,
        timeRemaining: timer.timeRemaining,
        isRunning: timer.isRunning,
        isPaused: timer.isPaused,
        isCompleted: timer.isCompleted,
      });
    }
  }, [timer]);

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for duration changes
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    
    setFormValues(prev => {
      const newDuration = {
        ...prev.duration,
        [name]: numValue,
      };
      
      // Calculate total duration in seconds
      const totalSeconds = (newDuration.minutes * 60) + newDuration.seconds;
      
      return {
        ...prev,
        duration: newDuration,
        totalDurationInSeconds: totalSeconds,
        timeRemaining: totalSeconds, // Reset time remaining to match new duration
      };
    });
  };

  // Handler for cycles change
  const handleCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numValue = parseInt(value, 10) || 1;
    
    setFormValues(prev => ({
      ...prev,
      cycles: numValue,
    }));
  };

  // Handler for form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {timer ? 'Edit Timer' : 'Add New Timer'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Timer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          required
          placeholder="e.g., Focus Work, Break"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Duration</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minutes" className="block text-sm font-medium mb-1">
              Minutes
            </label>
            <input
              type="number"
              id="minutes"
              name="minutes"
              min="0"
              max="60"
              value={formValues.duration.minutes}
              onChange={handleDurationChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label htmlFor="seconds" className="block text-sm font-medium mb-1">
              Seconds
            </label>
            <input
              type="number"
              id="seconds"
              name="seconds"
              min="0"
              max="59"
              value={formValues.duration.seconds}
              onChange={handleDurationChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="cycles" className="block text-sm font-medium mb-1">
          Number of Cycles
        </label>
        <input
          type="number"
          id="cycles"
          name="cycles"
          min="1"
          max="100"
          value={formValues.cycles}
          onChange={handleCyclesChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 mt-1">
          How many times the timer should repeat (1 = no repeat)
        </p>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timer ? 'Save Changes' : 'Add Timer'}
        </button>
      </div>
    </form>
  );
}