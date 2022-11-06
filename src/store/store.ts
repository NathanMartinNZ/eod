import create from "zustand"
import HabitsState from '../interfaces/HabitsState.interface'

const useHabitStore = create<HabitsState>((set) => ({
  habits: [
    {
      "id": "9b1dkb4d-3b7d-4bad-9bdd-2b097b3dcb6d",
      "title": "Write code",
      "description": "Description to give more context",
      "habitType": "boolean",
      "startingCount": undefined,
      "goalCount": undefined,
      "countDirection": "",
      "status": {
        "complete": false,
        "count": 0
      }
    },
    {
      "id": "2b1dks4d-2b7d-4bad-9bdd-2b097b3dcb6f",
      "title": "Consume calories",
      "description": "Other description to give more context",
      "habitType": "count",
      "startingCount": 0,
      "goalCount": 2500,
      "countDirection": "up",
      "status": {
        "complete": false,
        "count": 0
      }
    }
  ],

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