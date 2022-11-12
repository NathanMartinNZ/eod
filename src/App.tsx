import { useState, useEffect } from 'react'

import useHabitStore from './store/store';

import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

import Habit from './interfaces/Habit.interface'


function App() {
  const [dataLoaded, setDataLoaded] = useState(false)
  const { setInitialState } = useHabitStore()

  useEffect(() => {
    setInitialState()
    setDataLoaded(true)
  }, [])

  const habits:Habit[] = useHabitStore((state) => state.habits)

  return (
    <div className="App container-fluid">
      <div className="row">
        <h1>EOD</h1>
      </div>
      <div className="container">
        <div className="">
          {dataLoaded && habits && habits.map((habit) => {
            return <HabitContainer key={habit.id} {...habit}/>
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
