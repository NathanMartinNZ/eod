import React from 'react';

import { useQuery } from "react-query"

import CreateHabit from './components/CreateHabit';
import HabitContainer from './components/HabitContainer';

function App() {

  const { isLoading, error, data, isFetching } = useQuery(["habits"], () => {
    return [
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
  });

  return (
    <div className="App">
      <h1>EOD</h1>
      {data && data.map(habit => {
        return <HabitContainer key={habit.id} {...habit} />
      })}
      <CreateHabit />      
    </div>
  );
}

export default App;
