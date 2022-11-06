import useHabitStore from './store/store';

import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

function App() {

  const habits = useHabitStore((state) => state.habits)

  return (
    <div className="App container-fluid">
      <div className="row">
        <h1>EOD</h1>
      </div>
      <div className="container">
        <div className="">
          {habits && habits.map((habit) => {
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
