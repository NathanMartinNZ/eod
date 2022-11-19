import { useState, useEffect } from 'react'

import { useHabitStore, useHabitEntryStore } from './store/store';

import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

import Habit from './interfaces/Habit.interface'
import HabitEntry from './interfaces/HabitEntry.interface'


function App() {
  const [dataLoaded, setDataLoaded] = useState(false)
  const { setInitialState: setInitialHabitState } = useHabitStore()
  const { setInitialState: setInitialHabitEntryState } = useHabitEntryStore()

  useEffect(() => {
    // Set initial habits
    setInitialHabitState() 
    // Set initial habit entries
    setInitialHabitEntryState()
    // Set data loaded flag to display content
    setDataLoaded(true)
  }, [])

  const habits:Habit[] = useHabitStore((state) => state.habits)
  const habitEntries:HabitEntry[] = useHabitEntryStore((state) => state.habitEntries)

  return (
    <div className="App container-fluid">
      <div className="row">
        <h1>EOD</h1>
      </div>
      <div className="container">
        <div className="">
          {dataLoaded && habits && habits.map((habit) => {
            const habitEntryIdx = habitEntries.findIndex((h) => h.habit_id === habit.id)
            return <HabitContainer key={habit.id} {...habit} entry={habitEntries[habitEntryIdx]} />
          })}
        </div>
        <div className="">
          <CreateHabit />
        </div>
      </div>

    </div>
  );
}

export default App;
