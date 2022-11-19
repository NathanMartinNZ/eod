import create from 'zustand'
import Habit from '../interfaces/Habit.interface'
import HabitEntry from '../interfaces/HabitEntry.interface'
import HabitsState from '../interfaces/HabitsState.interface'
import HabitEntryState from '../interfaces/HabitEntriesState.interface'

import { v4 as uuidv4 } from 'uuid'
import getDateTimestamp from '../helpers/getDateTimestamp'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, child, get as dbGet, set as dbSet } from 'firebase/database'
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
        const fetchedArr:Habit[] = Object.entries(fetched).map(([, obj]:any) => ({ ...obj }))
        const sortedArr = fetchedArr.sort((a,b) => {
          if(typeof b.timestamp === "number" && typeof a.timestamp === "number") {
            return a.timestamp-b.timestamp
          }
          return 0
        })

        set(() => ({ habits: sortedArr }))
      })
  },

  addHabit: (habit:Habit) => set((state) => {
    // Create habit in DB
    dbSet(ref(db, "/habits/" + habit.id), habit)

    return { habits: [...state.habits, habit] }
  }),

  removeHabit: (habit:Habit) => set((state) => {
    // Remove habit in DB
    dbSet(ref(db, "/habits/" + habit.id), {})

    // Remove habit entries in 
    const getData = ref(db)
    dbGet(child(getData, "/habit_entries"))
      .then((snapshot) => {
        const fetched = snapshot.val()
        const fetchedArr = Object.entries(fetched).map(([, obj]:any) => ({ ...obj }))
        const filteredArr = fetchedArr.filter((entry) => entry.habit_id === habit.id)

        filteredArr.forEach((entry) => {
          dbSet(ref(db, "/habit_entries/" + entry.id), {})
        })
      })

    // New habits obj to set as state
    const habitsCopy = [...state.habits].filter((h) => h.id !== habit.id)
      
    return { habits: habitsCopy }
  })

}))

const useHabitEntryStore = create<HabitEntryState>((set) => ({
  habitEntries: [],

  setInitialState: () => {
    const getData = ref(db)
    dbGet(child(getData, "/habit_entries"))
      .then((snapshot) => {
        const fetched = snapshot.val()
        const fetchedArr = Object.entries(fetched).map(([, obj]:any) => ({ ...obj }))
        const filteredArr = fetchedArr.filter((entry) => entry.timestamp === getDateTimestamp())

        // Check if items were found
        if(filteredArr.length > 0) {
          set(() => ({ habitEntries: filteredArr }))
        } else {
          console.log("none found")
          // If not, create today's habitEntries
          const habitEntriesArr:any = []
          const habits = useHabitStore.getState().habits
          habits.forEach((habit) => {
            const entry = {
              timestamp: getDateTimestamp(),
              id: uuidv4(),
              habit_id: habit.id,
              complete: false,
              count: habit.startingCount
            }
            // Push to arr
            habitEntriesArr.push(entry)
            // Create entry in DB
            dbSet(ref(db, "/habit_entries/" + entry.id), entry)
          })
          // Set initial state
          set(() => ({ habitEntries: habitEntriesArr }))
        }

      })
  },

  addHabitEntry: (habitEntry:HabitEntry) => set((state) => {
    // Update db first
    dbSet(ref(db, "/habit_entries/" + habitEntry.id), habitEntry)

    return { habitEntries: [...state.habitEntries, habitEntry] }
  }),

  updateHabitEntry: (habitEntry:HabitEntry) => set((state) => {
        // Update db first
        dbSet(ref(db, "/habit_entries/" + habitEntry.id), habitEntry)
    
        // Update state second
        const habitEntriesCopy = [...state.habitEntries]
        habitEntriesCopy.map(h => {
          if(habitEntry.id === h.id) {
            return habitEntry
          }
          return h
        })
    
        return { habitEntries: habitEntriesCopy }
  })
  
}))

export { useHabitStore, useHabitEntryStore }