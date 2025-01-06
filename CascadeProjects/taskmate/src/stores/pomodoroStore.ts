import { create } from 'zustand';

interface PomodoroState {
  isRunning: boolean;
  timeLeft: number;
  currentSession: 'work' | 'break';
  workDuration: number;
  breakDuration: number;
  completedPomodoros: number;
  selectedTaskId: string | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
  setSelectedTask: (taskId: string | null) => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  isRunning: false,
  timeLeft: 25 * 60, // 25 minutes in seconds
  currentSession: 'work',
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  completedPomodoros: 0,
  selectedTaskId: null,

  startTimer: () => set({ isRunning: true }),
  
  pauseTimer: () => set({ isRunning: false }),
  
  resetTimer: () =>
    set((state) => ({
      isRunning: false,
      timeLeft: state.currentSession === 'work' ? state.workDuration : state.breakDuration,
    })),

  tick: () =>
    set((state) => {
      if (state.timeLeft <= 0) {
        const isWork = state.currentSession === 'work';
        return {
          timeLeft: isWork ? state.breakDuration : state.workDuration,
          currentSession: isWork ? 'break' : 'work',
          completedPomodoros: isWork ? state.completedPomodoros + 1 : state.completedPomodoros,
          isRunning: false,
        };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),

  switchToBreak: () =>
    set((state) => ({
      currentSession: 'break',
      timeLeft: state.breakDuration,
      isRunning: false,
    })),

  switchToWork: () =>
    set((state) => ({
      currentSession: 'work',
      timeLeft: state.workDuration,
      isRunning: false,
    })),

  setSelectedTask: (taskId: string | null) => set({ selectedTaskId: taskId }),
}));
