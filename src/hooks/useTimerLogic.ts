import { useState, useRef, useEffect } from 'react';
import { TimerConfig } from '@/types';

export function useTimerLogic(
  timer: TimerConfig,
  onTimerUpdate: (timerData: Partial<TimerConfig>) => void
) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const timerRef = useRef(timer);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update the ref when timer prop changes
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

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
  };

  // Function to create timer interval
  const createTimerInterval = () => {
    // Clear any existing interval first
    if (intervalId) {
      clearInterval(intervalId);
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
      resetTimer();
      return;
    }

    if (timer.isRunning) return;

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

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    onTimerUpdate({ 
      isRunning: false,
      isPaused: true 
    });
  };

  // Reset timer
  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

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
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    onTimerUpdate({
      isRunning: false,
      isPaused: false,
      isCompleted: true,
    });
  };

  // Manage interval based on timer state changes
  useEffect(() => {
    if (timer.isRunning && !intervalId) {
      createTimerInterval();
    } 
    else if (!timer.isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    timerRef.current = timer;
  }, [timer.isRunning]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer,
    audioRef
  };
}