import { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
} from "react-router-dom";
import { Link } from "react-router-dom";

import { useHabitStore, useHabitEntryStore, useUserStore } from "./store/store";

import firebaseApp from "./firebaseApp";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import Stats from "./components/Stats";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateHabit from "./components/CreateHabit";
import HabitContainer from "./components/HabitContainer";

function App() {
  const auth = getAuth(firebaseApp);

  const [authenticated, setAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { setInitialState: setInitialHabitState } = useHabitStore();
  const { setInitialState: setInitialHabitEntryState } = useHabitEntryStore();
  const { setUser: setUserState, clearUser } = useUserStore();
  const placeholderCount = useMemo(() => {
    const count = window.localStorage.getItem("hc");
    return count ? parseInt(count) : 0;
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set user details in user state
        setUserState(user);
        // Set authenticated flag to true
        setAuthenticated(true);
        // Set initial habits
        setInitialHabitState(user.uid);
        // Set initial habit entries
        setInitialHabitEntryState(user.uid);
        // Set data loaded flag to display content
        setDataLoaded(true);
      }
      // Set checked auth flag to true to display content at right time
      setCheckedAuth(true);
    });
  }, []);

  const habits: Habit[] = useHabitStore((state: any) => state.habits);
  const habitEntries: HabitEntry[] = useHabitEntryStore(
    (state) => state.habitEntries
  );

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    signOut(auth)
      .then(() => {
        // Clear user detals from state
        clearUser();
        // Clear habit count from local storage
        window.localStorage.removeItem("hc");
        // Set authenticated flag ot false
        setAuthenticated(false);
      })
      .finally(() => {
        redirect("/");
        window.location.href = "/";
      });
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="container">
          <header className="d-flex flex-wrap justify-content-between py-3 mb-4 border-bottom">
            <Link
              to="/"
              className="d-flex align-items-center mb-md-0 me-md-auto text-dark text-decoration-none"
            >
              <img src="/eod-logo.png" alt="EOD" style={{maxWidth: "70px", maxHeight: "48px"}} />
            </Link>
            {checkedAuth && !!authenticated && (
              <div className="d-flex">
                <Link to="/stats" className="btn d-flex align-items-center">
                  Stats
                </Link>
                <button className="btn" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </header>
        </div>

        <Routes>
          <Route
            path="/stats"
            element={<>{checkedAuth && authenticated && <Stats />}</>}
          />
          <Route
            path="/"
            element={
              <>
                {checkedAuth && !authenticated && (
                  <div className="container col-xl-10 col-xxl-8 px-4 py-5">
                    <div className="row">
                      <Login />
                      <div className="col-12 col-md-2 py-3 py-md-0 d-flex justify-content-center align-items-center">
                        or
                      </div>
                      <Register />
                    </div>
                  </div>
                )}

                {checkedAuth && authenticated && dataLoaded && (
                  <div className="container">
                    <div>
                      {habits && habits.length
                        ? habits.map((habit) => {
                            const habitEntryIdx = habitEntries.findIndex(
                              (h) => h.habit_id === habit.id
                            );
                            return (
                              <HabitContainer
                                key={habit.id}
                                {...habit}
                                entry={habitEntries[habitEntryIdx]}
                              />
                            );
                          })
                        : Array(placeholderCount)
                            .fill("")
                            .map((temp, i) => {
                              return (
                                <div
                                  key={i}
                                  className="habit-placeholder container col-xl-10 col-xxl-8 px-4 py-3 mb-4"
                                ></div>
                              );
                            })}
                    </div>
                    <CreateHabit />
                  </div>
                )}
              </>
            }
          />
        </Routes>

        {showLogoutConfirm && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
            onClick={handleLogoutCancel}
          >
            <div
              className="bg-white rounded p-4 shadow"
              style={{ maxWidth: "400px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3">Confirm Logout</h3>
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={handleLogoutCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
