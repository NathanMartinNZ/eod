export {}

declare global {
  interface Habit {
    timestamp: object | number;
    id: string;
    title: string;
    description: string;
    habitType: string;
    startingCount?: number;
    goalCount?: number;
    countDirection: string;
    entry?: HabitEntry;
  }

  interface HabitEntry {
    timestamp: number;
    id: string;
    habit_id: string;
    complete: boolean;
    count: number;
  }

  interface User {
    uid: string;
    email: string;
    accessToken: string;
  }

  interface HabitsState {
    habits: Array<Habit>;
    setInitialState: (uid:string) => void;
    addHabit: (habit:Habit) => void;
    removeHabit: (habit:Habit) => void;
  }

  interface HabitEntriesState {
    habitEntries: Array<HabitEntry>;
    habitEntriesHist: Array<HabitEntry>;
    setInitialState: (uid:string) => void;
    addHabitEntry: (habitEntry:HabitEntry) => void;
    updateHabitEntry: (habitEntry:HabitEntry) => void;
  }

  interface UserState {
    user: User;
    setUser: (user:any) => void;
    clearUser: () => void;
  }
}