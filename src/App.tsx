import { useState, useEffect } from 'react'

import useHabitStore from './store/store';

import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

import Habit from './interfaces/Habit.interface'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, child, get } from 'firebase/database'
import firebaseConfig from './firebaseServiceAccountKey.js'


function App() {
  const firebaseApp = initializeApp(firebaseConfig)
  const db = getDatabase(firebaseApp)
  const getData = ref(db)

  const [dataLoaded, setDataLoaded] = useState(false)
  const { setInitialState } = useHabitStore()

  useEffect(() => {
    const fetchData = () => {
      get(child(getData, "/habits"))
        .then((snapshot) => {
          const fetched = snapshot.val()
          const fetchedArr = Object.entries(fetched).map(([name, obj]:any) => ({ ...obj }))

          setInitialState(fetchedArr)
          setDataLoaded(true)
        })
    }

    fetchData()

    
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
