'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TimerConfig, TimerManagementState } from '@/types';

// Default values for Timer Management
const defaultTimerManagement: TimerManagementState = {
  timers: {},
  activeTimers: [],
};

// Interface for context
interface TimerContextType {
  timers: { [key: string]: TimerConfig };
  activeTimers: string[];
  addTimer: (timer: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTimer: (timer: Partial<TimerConfig> & { id: string }) => void;
  deleteTimer: (timerId: string) => void;
  updateTimerStatus: (timerId: string, timerData: Partial<TimerConfig>) => void;
}

// Create context
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Provider component
export const TimerProvider = ({ children }: { children: ReactNode }) => {
  // State to store Timer Management data
  const [timerManagement, setTimerManagement] = useState<TimerManagementState>(defaultTimerManagement);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('timerManagement');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTimerManagement(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('timerManagement', JSON.stringify(timerManagement));
  }, [timerManagement]);

  // Function to add a new timer
  const addTimer = (timerData: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `timer-${Date.now()}`;
    const timestamp = Date.now();
    
    const newTimer: TimerConfig = {
      ...timerData,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setTimerManagement(prev => ({
      ...prev,
      timers: { ...prev.timers, [id]: newTimer },
    }));
  };

  // Function to update a timer
  const updateTimer = (updatedTimer: Partial<TimerConfig> & { id: string }) => {
    setTimerManagement(prev => {
      const timer = prev.timers[updatedTimer.id];
      if (!timer) return prev;
      
      return {
        ...prev,
        timers: {
          ...prev.timers,
          [updatedTimer.id]: {
            ...timer,
            ...updatedTimer,
            updatedAt: Date.now(),
          },
        },
      };
    });
  };

  // Function to delete a timer
  const deleteTimer = (timerId: string) => {
    setTimerManagement(prev => {
      const newTimers = { ...prev.timers };
      delete newTimers[timerId];
      
      return {
        ...prev,
        timers: newTimers,
        activeTimers: prev.activeTimers.filter(id => id !== timerId),
      };
    });
  };

  // Function to update timer status
  const updateTimerStatus = (timerId: string, timerData: Partial<TimerConfig>) => {
    setTimerManagement(prev => {
      const timer = prev.timers[timerId];
      if (!timer) return prev;
      
      const updatedTimer = {
        ...timer,
        ...timerData,
        updatedAt: Date.now(),
      };
      
      // Update active timers list
      let newActiveTimers = [...prev.activeTimers];
      
      if (timerData.isRunning && !prev.activeTimers.includes(timerId)) {
        newActiveTimers.push(timerId);
      } else if (timerData.isRunning === false && prev.activeTimers.includes(timerId)) {
        newActiveTimers = newActiveTimers.filter(id => id !== timerId);
      }
      
      return {
        ...prev,
        timers: {
          ...prev.timers,
          [timerId]: updatedTimer,
        },
        activeTimers: newActiveTimers,
      };
    });
  };

  // Values provided by context
  const value = {
    timers: timerManagement.timers,
    activeTimers: timerManagement.activeTimers,
    addTimer,
    updateTimer,
    deleteTimer,
    updateTimerStatus,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

// Hook to use context
export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};