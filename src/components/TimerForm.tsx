'use client';

import { useState } from 'react';
import { TimerConfig } from '@/types';

interface TimerFormProps {
  timer?: TimerConfig;
  onSubmit: (timerData: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TimerForm({ timer, onSubmit, onCancel }: TimerFormProps) {
  // Initialize form state with timer data if editing, or defaults if creating
  const [formData, setFormData] = useState({
    name: timer?.name || '',
    minutes: timer?.duration.minutes || 25,
    seconds: timer?.duration.seconds || 0,
    cycles: timer?.cycles || 1,
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (name === 'minutes' || name === 'seconds' || name === 'cycles') {
      const numValue = parseInt(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      alert('Please enter a timer name');
      return;
    }
    
    if (formData.minutes === 0 && formData.seconds === 0) {
      alert('Timer duration must be greater than 0');
      return;
    }
    
    if (formData.cycles < 1) {
      alert('Number of cycles must be at least 1');
      return;
    }
    
    // Calculate total duration in seconds
    const totalDurationInSeconds = (formData.minutes * 60) + formData.seconds;
    
    // Prepare timer data
    const timerData = {
      name: formData.name,
      duration: {
        minutes: formData.minutes,
        seconds: formData.seconds,
      },
      totalDurationInSeconds,
      cycles: formData.cycles,
      currentCycle: timer?.currentCycle || 1,
      timeRemaining: timer?.timeRemaining || totalDurationInSeconds,
      isRunning: timer?.isRunning || false,
      isPaused: timer?.isPaused || false,
      isCompleted: timer?.isCompleted || false,
    };
    
    // Submit timer data
    onSubmit(timerData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {timer ? 'Edit Timer' : 'Create New Timer'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Timer Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Focus Session"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minutes
          </label>
          <input
            type="number"
            id="minutes"
            name="minutes"
            value={formData.minutes}
            onChange={handleChange}
            min="0"
            max="59"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="seconds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Seconds
          </label>
          <input
            type="number"
            id="seconds"
            name="seconds"
            value={formData.seconds}
            onChange={handleChange}
            min="0"
            max="59"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="cycles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Number of Cycles
        </label>
        <input
          type="number"
          id="cycles"
          name="cycles"
          value={formData.cycles}
          onChange={handleChange}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {timer ? 'Update Timer' : 'Create Timer'}
        </button>
      </div>
    </form>
  );
}