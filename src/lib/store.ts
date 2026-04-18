import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  title: string;
  sets?: string;
  reps?: string;
  time?: string;
  completed: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface WeeklyPlan {
  [key: string]: PlannedExercise[];
}

export interface MetricEntry {
  date: string;
  value: number;
  label: string;
}

export interface ForgeStore {
  weeklyPlan: WeeklyPlan;
  waterCount: number;
  waterGoal: number;
  proteinGoalReached: boolean;
  metrics: {
    weight: MetricEntry[];
    maxLoad: { [exercise: string]: MetricEntry[] };
    distance: MetricEntry[];
  };
  
  addExerciseToDay: (day: DayOfWeek, exercise: Partial<PlannedExercise>) => void;
  toggleExercise: (day: DayOfWeek, exerciseId: string) => void;
  removeExercise: (day: DayOfWeek, exerciseId: string) => void;
  resetWeeklyChecks: () => void;
  
  incrementWater: () => void;
  resetWater: () => void;
  toggleProtein: () => void;
  
  addMetric: (type: 'weight' | 'distance', value: number) => void;
  addMaxLoad: (exercise: string, value: number) => void;
}

export const useForgeStore = create<ForgeStore>()(
  persist(
    (set) => ({
      weeklyPlan: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      },
      waterCount: 0,
      waterGoal: 8,
      proteinGoalReached: false,
      metrics: {
        weight: [],
        maxLoad: {},
        distance: [],
      },

      addExerciseToDay: (day, exercise) => set((state) => ({
        weeklyPlan: {
          ...state.weeklyPlan,
          [day]: [...state.weeklyPlan[day], {
            id: Math.random().toString(36).substring(2, 9),
            exerciseId: exercise.exerciseId || '',
            title: exercise.title || 'Sem título',
            sets: exercise.sets || '3',
            reps: exercise.reps || '12',
            time: exercise.time || '',
            completed: false,
          }],
        }
      })),

      toggleExercise: (day, id) => set((state) => ({
        weeklyPlan: {
          ...state.weeklyPlan,
          [day]: state.weeklyPlan[day].map(ex => 
            ex.id === id ? { ...ex, completed: !ex.completed } : ex
          ),
        }
      })),

      removeExercise: (day, id) => set((state) => ({
        weeklyPlan: {
          ...state.weeklyPlan,
          [day]: state.weeklyPlan[day].filter(ex => ex.id !== id),
        }
      })),

      resetWeeklyChecks: () => set((state) => {
        const resetPlan = { ...state.weeklyPlan };
        Object.keys(resetPlan).forEach(day => {
          resetPlan[day] = resetPlan[day].map(ex => ({ ...ex, completed: false }));
        });
        return { 
          weeklyPlan: resetPlan,
          waterCount: 0,
          proteinGoalReached: false,
        };
      }),

      incrementWater: () => set((state) => ({ waterCount: state.waterCount + 1 })),
      resetWater: () => set({ waterCount: 0 }),
      toggleProtein: () => set((state) => ({ proteinGoalReached: !state.proteinGoalReached })),

      addMetric: (type, value) => set((state) => ({
        metrics: {
          ...state.metrics,
          [type]: [...state.metrics[type], {
            date: new Date().toISOString().split('T')[0],
            value,
            label: new Date().toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
          }].slice(-10)
        }
      })),

      addMaxLoad: (exercise, value) => set((state) => {
        const exerciseMetrics = state.metrics.maxLoad[exercise] || [];
        return {
          metrics: {
            ...state.metrics,
            maxLoad: {
              ...state.metrics.maxLoad,
              [exercise]: [...exerciseMetrics, {
                date: new Date().toISOString().split('T')[0],
                value,
                label: new Date().toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
              }].slice(-10)
            }
          }
        };
      }),
    }),
    {
      name: 'forge-fit-storage',
    }
  )
);