import create from "zustand"
import HabitsState from '../interfaces/HabitsState.interface'

const useHabitStore = create<HabitsState>((set) => ({
  habits: [],

  setInitialState: (habits:any) => set(() => ({ habits: habits })),

  addHabit: (newHabit) => set((state) => ({ habits: [...state.habits, newHabit] })),

  updateHabit: (habit) => set((state) => {
    const habitsCopy = [...state.habits]
    console.log(habit)
    habitsCopy.map(h => {
      if(habit.id === h.id) {
        console.log(habit.id, " found")
        return habit
      }
      return h
    })
    return { habits: habitsCopy }
  })

  // updateHabit: (habit) => set((state) => ({ habits: [...state.habits] })) // TODO: Update specific habit
  
}))

export default useHabitStore