'use client';

import { useEffect, useState, useRef } from 'react';
import { TimerConfig } from '@/types';

interface TimerProps {
  timer: TimerConfig;
  onTimerUpdate: (timerData: Partial<TimerConfig>) => void;
  className?: string;
}

export default function Timer({ timer, onTimerUpdate, className = '' }: TimerProps) {
  // State for handling timer interval
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format time remaining to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

    // Create interval to decrease remaining time every second
    const id = setInterval(() => {
      // Use the current timer state directly
      const newTimeRemaining = timer.timeRemaining - 1;

      // If time is up
      if (newTimeRemaining <= 0) {
        // Stop interval
        clearInterval(id);
        setIntervalId(null);

        // Play notification sound
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }

        // Show browser notification
        showNotification(`Timer "${timer.name}" completed!`);

        // If there are cycles remaining
        if (timer.currentCycle < timer.cycles) {
          // Move to next cycle
          onTimerUpdate({
            timeRemaining: timer.totalDurationInSeconds, // Reset time
            currentCycle: timer.currentCycle + 1,
            isRunning: false,
            isPaused: false,
            isCompleted: false,
          });
        } else {
          // If all cycles are completed
          onTimerUpdate({
            isRunning: false,
            isPaused: false,
            isCompleted: true,
          });
        }
      } else {
        // If time is still remaining, decrease time
        onTimerUpdate({
          timeRemaining: newTimeRemaining,
        });
      }
    }, 1000);

    setIntervalId(id);
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

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Get timer status text
  const getTimerStatus = (): string => {
    if (timer.isCompleted) return 'Completed';
    if (timer.isRunning) return 'Running';
    if (timer.isPaused) return 'Paused';
    return 'Ready';
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-3xl font-bold mb-2">
        {formatTime(timer.timeRemaining)}
      </div>
      
      <div className="text-sm mb-2">
        Cycle {timer.currentCycle} of {timer.cycles}
      </div>
      
      <div className="text-sm mb-4 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
        {getTimerStatus()}
      </div>
      
      <div className="flex gap-2">
        {!timer.isRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            disabled={timer.isCompleted}
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Reset
        </button>
        
        <button
          onClick={stopTimer}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Stop
        </button>
      </div>
      
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src="/notification.mp3" />
    </div>
  );
}