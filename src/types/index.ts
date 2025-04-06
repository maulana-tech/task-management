// Tipe data untuk aplikasi Timer Management

// Tipe data untuk timer
export interface TimerConfig {
  id: string; // ID unik untuk timer
  name: string; // Nama timer (e.g., 'Focus Work', 'Break')
  duration: {
    minutes: number;
    seconds: number;
  }; // durasi dalam menit dan detik
  totalDurationInSeconds: number; // total durasi dalam detik (untuk kemudahan perhitungan)
  cycles: number; // jumlah siklus timer
  currentCycle: number; // siklus saat ini
  timeRemaining: number; // waktu tersisa dalam detik
  isRunning: boolean; // status timer (berjalan atau tidak)
  isPaused: boolean; // status jeda
  isCompleted: boolean; // status selesai
  createdAt: number; // waktu pembuatan timer (timestamp)
  updatedAt: number; // waktu terakhir update timer (timestamp)
}

// Tipe data untuk state Timer Management
export interface TimerManagementState {
  timers: {
    [key: string]: TimerConfig;
  };
  activeTimers: string[]; // IDs of currently active timers
}