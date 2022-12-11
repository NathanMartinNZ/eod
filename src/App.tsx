import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';

import { useHabitStore, useHabitEntryStore, useUserStore } from './store/store';

import firebaseApp from './firebaseApp'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth" 

import Stats from './components/Stats'
import Register from './components/Register';
import Login from './components/Login';
import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';


function App() {
  const auth = getAuth(firebaseApp)

  const [authenticated, setAuthenticated] = useState(false)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const { setInitialState: setInitialHabitState } = useHabitStore()
  const { setInitialState: setInitialHabitEntryState } = useHabitEntryStore()
  const { setUser: setUserState, clearUser } = useUserStore()
  const placeholderCount = useMemo(() => {
    const count = window.localStorage.getItem("hc")
    return count ? parseInt(count) : 0
  }, [])

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
  }, [])

  const habits:Habit[] = useHabitStore((state) => state.habits)
  const habitEntries:HabitEntry[] = useHabitEntryStore((state) => state.habitEntries)

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Clear user detals from state
      clearUser()
      // Clear habit count from local storage
      window.localStorage.removeItem("hc")
      // Set authenticated flag ot false
      setAuthenticated(false)
    }).finally(() => {
      console.log('test')
      redirect("/")
      window.location.href = "/"
    })
  } 

  console.log(placeholderCount)

  return (
    <Router>
      <div className="App">
        <div className="container">
          <header className="d-flex flex-wrap justify-content-between py-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center mb-md-0 me-md-auto text-dark text-decoration-none">
              <h1 className="h1 m-0">EOD</h1>
            </a>
            {checkedAuth && !!authenticated && (
              <div className="d-flex">
                <a href="/stats" className="btn d-flex align-items-center">Stats</a>
                <button className="btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </header>
        </div>

        <Routes>
          <Route path="/stats" element={
            <>
            {checkedAuth && authenticated && (
              <Stats />
            )}
            </>
          } />
          <Route path="/" element={
            <>
            {checkedAuth && !authenticated && (
              <div className="container col-xl-10 col-xxl-8 px-4 py-5">
                <div className="row">
                  <Login />
                  <div className="col-12 col-md-2 py-3 py-md-0 d-flex justify-content-center align-items-center">or</div>
                  <Register />
                </div>
              </div>
            )}

            {checkedAuth && authenticated && dataLoaded && (
              <div className="container">
                <div>
                  {habits && habits.length ? habits.map((habit) => {
                    const habitEntryIdx = habitEntries.findIndex((h) => h.habit_id === habit.id)
                    return <HabitContainer key={habit.id} {...habit} entry={habitEntries[habitEntryIdx]} />
                  }) : Array(placeholderCount).fill("").map((temp, i) => {
                    return <div key={i} className="habit-placeholder container col-xl-10 col-xxl-8 px-4 py-3 mb-4"></div>
                  })}
                </div>
                <CreateHabit />
              </div>
            )}
            </>
          } />
        </Routes>


      </div>
    </Router>
  );
}

export default App;
