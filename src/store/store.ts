import create from "zustand"
import HabitsState from '../interfaces/HabitsState.interface'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, child, get as dbGet, set as dbSet, serverTimestamp } from 'firebase/database'
import firebaseConfig from '../firebaseServiceAccountKey.js'

const firebaseApp = initializeApp(firebaseConfig)
const db = getDatabase(firebaseApp)

const useHabitStore = create<HabitsState>((set) => ({
  habits: [],

  setInitialState: () => {
    const getData = ref(db)
    dbGet(child(getData, "/habits"))
      .then((snapshot) => {
        const fetched = snapshot.val()
        const fetchedArr = Object.entries(fetched).map(([, obj]:any) => ({ ...obj }))

        set(() => ({ habits: fetchedArr }))
      })
  },

  addHabit: (habit) => set((state) => {
    dbSet(ref(db, "/habits/" + habit.id), habit)

    return { habits: [...state.habits, habit] }
  }),

  updateHabit: (habit) => set((state) => {
    // Update db first
    dbSet(ref(db, "/habits/" + habit.id), habit)
    
    // Update state second
    const habitsCopy = [...state.habits]
    habitsCopy.map(h => {
      if(habit.id === h.id) {
        return habit
      }
      return h
    })

    return { habits: habitsCopy }
  })
  
}))

export default useHabitStore