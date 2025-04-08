'use client';

import { useEffect, useState, useRef } from 'react';
import { TimerConfig } from '@/types';

interface TimerProps {
  timer: TimerConfig;
  onTimerUpdate: (timerData: Partial<TimerConfig>) => void;
  className?: string;
  fullscreen?: boolean;
  onExitFullscreen?: () => void;
}

export default function Timer({ timer, onTimerUpdate, className = '', fullscreen = false, onExitFullscreen }: TimerProps) {
  // State for handling timer interval
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef(timer); // Reference to keep track of current timer state

  // Update the ref when timer prop changes
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // Format time remaining to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to create timer interval
  const createTimerInterval = () => {
    // Clear any existing interval first
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    const id = setInterval(() => {
      const currentTimer = timerRef.current;
      const newTimeRemaining = currentTimer.timeRemaining - 1;

      if (newTimeRemaining <= 0) {
        clearInterval(id);
        setIntervalId(null);

        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }

        showNotification(`Timer "${currentTimer.name}" completed!`);

        if (currentTimer.currentCycle < currentTimer.cycles) {
          onTimerUpdate({
            timeRemaining: currentTimer.totalDurationInSeconds,
            currentCycle: currentTimer.currentCycle + 1,
            isRunning: false,
            isPaused: false,
            isCompleted: false,
          });
        } else {
          onTimerUpdate({
            isRunning: false,
            isPaused: false,
            isCompleted: true,
          });
        }
      } else {
        onTimerUpdate({
          timeRemaining: newTimeRemaining,
        });
      }
    }, 1000);

    setIntervalId(id);
    return id;
  };

  // Start timer
  const startTimer = () => {
    if (timer.timeRemaining <= 0) {
      // If timer is finished, reset first
      resetTimer();
      return;
    }

    // If timer is already running, do nothing
    if (timer.isRunning) return;

    // Update timer status to running
    onTimerUpdate({ 
      isRunning: true,
      isPaused: false,
      isCompleted: false
    });

    createTimerInterval();
  };

  // Pause timer
  const pauseTimer = () => {
    if (!timer.isRunning) return;

    // Stop interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Update timer status
    onTimerUpdate({ 
      isRunning: false,
      isPaused: true 
    });
  };

  // Reset timer
  const resetTimer = () => {
    // Stop interval if exists
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Reset timer to initial values
    onTimerUpdate({
      timeRemaining: timer.totalDurationInSeconds,
      currentCycle: 1,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });
  };

  // Stop timer completely
  const stopTimer = () => {
    // Stop interval if exists
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Mark timer as completed
    onTimerUpdate({
      isRunning: false,
      isPaused: false,
      isCompleted: true,
    });
  };

  // Show browser notification
  const showNotification = (message: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    }
    
    // Fallback to alert if notifications are not supported or permitted
    alert(message);
  };

  // Handle running timer when component mounts or when timer.isRunning changes
  useEffect(() => {
    // If timer should be running but no interval exists, create one
    if (timer.isRunning && !intervalId) {
      createTimerInterval();
    } 
    // If timer should not be running but interval exists, clear it
    else if (!timer.isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [timer.isRunning, fullscreen]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Get timer status text
  const getTimerStatus = (): string => {
    if (timer.isCompleted) return 'Completed';
    if (timer.isRunning) return 'Running';
    if (timer.isPaused) return 'Paused';
    return 'Ready';
  };

  // Calculate progress percentage
  const progressPercentage = (timer.totalDurationInSeconds - timer.timeRemaining) / timer.totalDurationInSeconds * 100;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onExitFullscreen}
            className="text-gray-400 hover:text-white p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="text-gray-300 text-2xl mb-4">{timer.name}</h2>
          
          <div className="text-white text-8xl font-bold mb-8">
            {formatTime(timer.timeRemaining)}
          </div>
          
          <div className="w-64 h-2 bg-gray-700 rounded-full mb-8 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-gray-400 text-xl mb-8">
            Cycle {timer.currentCycle} of {timer.cycles}
          </div>
          
          <div className="flex gap-6 justify-center">
            {!timer.isRunning ? (
              <button
                onClick={startTimer}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-xl font-medium hover:bg-gray-200 transition-colors"
                disabled={timer.isCompleted}
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Pause
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="bg-gray-700 text-white px-8 py-4 rounded-lg text-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <audio ref={audioRef} src="/notification.mp3" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 mb-4 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gray-500 dark:bg-gray-400"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        {formatTime(timer.timeRemaining)}
      </div>
      
      <div className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        Cycle {timer.currentCycle} of {timer.cycles}
      </div>
      
      <div className="text-sm mb-4 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        {getTimerStatus()}
      </div>
      
      <div className="flex gap-2">
        {!timer.isRunning ? (
          <button
            onClick={startTimer}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
            disabled={timer.isCompleted}
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Reset
        </button>
        
        <button
          onClick={stopTimer}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors"
        >
          Stop
        </button>
      </div>
      
      <audio ref={audioRef} src="/notification.mp3" />
    </div>
  );
}