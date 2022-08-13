import React from 'react';
import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

function App() {

  //TODO: Pull from database
  const habits = [
    {
      "id": 0,
      "title": "Write code",
      "description": "",
      "habitType": "Boolean", // or "CountUp"
      "status": {
        "complete": false,
        "count": 0,
      }
    }
  ]

  return (
    <div className="App">
      <h1>EOD</h1>
      {habits.map(habit => {
        return <HabitContainer key={habit.id} {...habit} />
      })}
      <CreateHabit />      
    </div>
  );
}

export default App;
