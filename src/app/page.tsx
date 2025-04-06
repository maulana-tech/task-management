'use client';

import { useState } from 'react';
import { TimerProvider } from '@/context/TimerContext';
import TimerForm from '@/components/TimerForm';
import { TimerConfig } from '@/types';
import { useTimerContext } from '@/context/TimerContext';
import TimerList from '@/components/TimerList';

// Component for main app content
function TimerManagementApp() {
  const { addTimer } = useTimerContext();
  const [showForm, setShowForm] = useState(false);

  // Handler for adding new timer
  const handleAddTimer = (timerData: Omit<TimerConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTimer(timerData);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Timer Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Add Timer
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="container mx-auto">
          <TimerList />
        </div>
      </main>

      {/* Modal for add timer form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <TimerForm
              onSubmit={handleAddTimer}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Main page with Provider
export default function Home() {
  return (
    <TimerProvider>
      <TimerManagementApp />
    </TimerProvider>
  );
}
