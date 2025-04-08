'use client';

import { useEffect } from 'react';
import { TimerConfig } from '@/types';
import { useTimerLogic } from '@/hooks/useTimerLogic';

interface TimerProps {
  timer: TimerConfig;
  onTimerUpdate: (timerData: Partial<TimerConfig>) => void;
  className?: string;
  fullscreen?: boolean;
  onExitFullscreen?: () => void;
}

export default function Timer({ timer, onTimerUpdate, className = '', fullscreen = false, onExitFullscreen }: TimerProps) {
  const { startTimer, pauseTimer, resetTimer, stopTimer, audioRef } = useTimerLogic(timer, onTimerUpdate);

  // Format time remaining to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
            
            <button
              onClick={stopTimer}
              className="bg-gray-700 text-white px-8 py-4 rounded-lg text-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Stop
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