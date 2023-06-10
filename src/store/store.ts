import { create } from "zustand";

import { v4 as uuidv4 } from "uuid";
import getDateTimestamp from "../helpers/getDateTimestamp";

import firebaseApp from "../firebaseApp";
import {
  getDatabase,
  ref,
  child,
  get as dbGet,
  set as dbSet,
} from "firebase/database";

const db = getDatabase(firebaseApp);

const useHabitStore: any = create<HabitsState>((set) => ({
  habits: [],

  setInitialState: (uid) => {
    const getData = ref(db);
    dbGet(child(getData, `/habits/${uid}`)).then((snapshot) => {
      const fetched = snapshot.val();
      if (fetched) {
        let fetchedArr: Habit[] = Object.entries(fetched).map(
          ([, obj]: any) => ({ ...obj })
        );
        fetchedArr = fetchedArr.sort((a, b) => {
          if (
            typeof b.timestamp === "number" &&
            typeof a.timestamp === "number"
          ) {
            return a.timestamp - b.timestamp;
          }
          return 0;
        });
        // Set store state
        set(() => ({ habits: fetchedArr }));
        // Set number of habits in local storage for preload display
        window.localStorage.setItem("hc", fetchedArr.length.toString());
      }
    });
  },

  getHabitById: (habitId) => {
    const habit: Habit | undefined = useHabitStore
      .getState()
      .habits.find((h: Habit) => h.id === habitId);
    return habit;
  },

  addHabit: (habit: Habit) =>
    set((state) => {
      const uid = useUserStore.getState().user.uid;
      // Create habit in DB
      dbSet(ref(db, `/habits/${uid}/` + habit.id), habit);

      // Set number of habits in local storage for preload display
      window.localStorage.setItem(
        "hc",
        JSON.stringify(state.habits.length + 1)
      );

      return { habits: [...state.habits, habit] };
    }),

  removeHabit: (habit: Habit) =>
    set((state) => {
      const uid = useUserStore.getState().user.uid;
      // Remove habit in DB
      dbSet(ref(db, `/habits/${uid}/` + habit.id), {});

      // Set number of habits in local storage for preload display
      window.localStorage.setItem(
        "hc",
        JSON.stringify(state.habits.length - 1)
      );

      // Remove habit entries in
      const getData = ref(db);
      dbGet(child(getData, `/habit_entries/${uid}`)).then((snapshot) => {
        const fetched = snapshot.val();
        const fetchedArr = Object.entries(fetched).map(([, obj]: any) => ({
          ...obj,
        }));
        const filteredArr = fetchedArr.filter(
          (entry) => entry.habit_id === habit.id
        );

        filteredArr.forEach((entry) => {
          dbSet(ref(db, `/habit_entries/${uid}/` + entry.id), {});
        });
      });

      // New habits obj to set as state
      const habitsCopy = [...state.habits].filter((h) => h.id !== habit.id);

      return { habits: habitsCopy };
    }),
}));

const useHabitEntryStore = create<HabitEntriesState>((set) => ({
  habitEntries: [],
  habitEntriesHist: [],

  setInitialState: (uid) => {
    const getData = ref(db);
    dbGet(child(getData, `/habit_entries/${uid}`)).then((snapshot) => {
      const fetched = snapshot.val();

      // Check if items were found
      if (fetched) {
        let fetchedArr = Object.entries(fetched).map(([, obj]: any) => ({
          ...obj,
        }));
        let fetchedArrToday = fetchedArr.filter(
          (entry) => entry.timestamp === getDateTimestamp()
        );
        let fetchedArrHist = fetchedArr.filter(
          (entry) => entry.timestamp !== getDateTimestamp()
        );

        if (fetchedArrToday.length > 0) {
          set(() => ({ habitEntries: fetchedArrToday }));
        } else {
          // If not, create today's habitEntries
          const habitEntriesArr: any = [];
          const habits = useHabitStore.getState().habits;
          habits.forEach((habit: Habit) => {
            const entry = {
              timestamp: getDateTimestamp(),
              id: uuidv4(),
              habit_id: habit.id,
              complete: false,
              count: habit.startingCount,
            };
            // Push to arr
            habitEntriesArr.push(entry);
            // Create entry in DB
            dbSet(ref(db, `/habit_entries/${uid}/` + entry.id), entry);
          });
          // Set initial state
          set(() => ({ habitEntries: habitEntriesArr }));
        }

        if (fetchedArrHist.length > 0) {
          set(() => ({ habitEntriesHist: fetchedArrHist }));
        }
      }
    });
  },

  addHabitEntry: (habitEntry: HabitEntry) =>
    set((state) => {
      const uid = useUserStore.getState().user.uid;
      // Update db first
      dbSet(ref(db, `/habit_entries/${uid}/` + habitEntry.id), habitEntry);

      return { habitEntries: [...state.habitEntries, habitEntry] };
    }),

  updateHabitEntry: (habitEntry: HabitEntry) =>
    set((state) => {
      const uid = useUserStore.getState().user.uid;
      // Update db first
      dbSet(ref(db, `/habit_entries/${uid}/` + habitEntry.id), habitEntry);

      // Update state second
      const habitEntriesCopy = [...state.habitEntries];
      habitEntriesCopy.map((h) => {
        if (habitEntry.id === h.id) {
          return habitEntry;
        }
        return h;
      });

      return { habitEntries: habitEntriesCopy };
    }),
}));

const useUserStore = create<UserState>((set) => ({
  user: { uid: "", email: "", accessToken: "" },

  setUser: (user: User) =>
    set(() => {
      return { user: user };
    }),

  clearUser: () =>
    set(() => {
      return { user: { uid: "", email: "", accessToken: "" } };
    }),
}));

export { useHabitStore, useHabitEntryStore, useUserStore };
