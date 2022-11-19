import { useState, useEffect } from 'react'

import { useHabitStore, useHabitEntryStore, useUserStore } from './store/store';

import firebaseApp from './firebaseApp'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth" 

import Register from './components/Register';
import Login from './components/Login';
import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

import Habit from './interfaces/Habit.interface'
import HabitEntry from './interfaces/HabitEntry.interface'


function App() {
  const auth = getAuth(firebaseApp)

  const [authenticated, setAuthenticated] = useState(false)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const { setInitialState: setInitialHabitState } = useHabitStore()
  const { setInitialState: setInitialHabitEntryState } = useHabitEntryStore()
  const { setUser: setUserState, clearUser } = useUserStore()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        // Set user details in user state
        setUserState(user)
        // Set authenticated flag to true
        setAuthenticated(true)
        // Set initial habits
        setInitialHabitState(user.uid) 
        // Set initial habit entries
        setInitialHabitEntryState(user.uid)
        // Set data loaded flag to display content
        setDataLoaded(true)
      }
      // Set checked auth flag to true to display content at right time
      setCheckedAuth(true)
    })
  }, [authenticated])

  const habits:Habit[] = useHabitStore((state) => state.habits)
  const habitEntries:HabitEntry[] = useHabitEntryStore((state) => state.habitEntries)

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Clear user detals from state
      clearUser()
      // Set authenticated flag ot false
      setAuthenticated(false)
    })
  } 

  return (
    <div className="App container-fluid">
      <div className="row">
        <h1>EOD</h1>
        {checkedAuth && !!authenticated && <button onClick={handleLogout}>Logout</button>}
      </div>

      {checkedAuth && !authenticated && (
        <div>
          <Register />
          <Login />
        </div>
      )}

      {checkedAuth && authenticated && (
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
      )}
    </div>
  );
}

export default App;
