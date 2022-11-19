import { useHabitStore, useHabitEntryStore } from '../store/store';
import { useState } from 'react'

import Habit from '../interfaces/Habit.interface'


function HabitContainer(props:Habit) {
  // State for input number (used to increase/decrease count)
  const [inputNum, setInputNum] = useState(1)

  // Create copy of props
  const habit = {...props}

  // Updating habit state
  const removeHabit = useHabitStore((state) => state.removeHabit)
  // Updating habit entry state
  const updateHabitEntry = useHabitEntryStore((state) => state.updateHabitEntry)

  const handleUpdateComplete = (complete:boolean) => {
    if(!habit.entry) { return }
    habit.entry.complete = complete
    updateHabitEntry(habit.entry)
  }

  const handleUpdateCount = (direction:string) => {
    if(!habit.entry) { return }
    habit.entry.count = (direction === "up" ? habit.entry.count + inputNum : habit.entry.count - inputNum)
    // Check if count goal is met
    if(habit.countDirection === "up") {
      habit.entry.count >= habit.goalCount! ? habit.entry.complete = true : habit.entry.complete = false
    } else if(habit.countDirection === "down") {
      habit.entry.count <= habit.goalCount! ? habit.entry.complete = true : habit.entry.complete = false
    }

    updateHabitEntry(habit.entry)
  }

  const handleRemoveHabit = (habit:Habit) => {
    removeHabit(habit)
  }

  const statusRender = () => {
    switch(habit.habitType) {
      case "boolean":
        return (
          <div className="col">
            <input className="habit-check form-check-input" type="checkbox" onChange={() => handleUpdateComplete(!props.entry?.complete)} checked={props.entry?.complete ? true : false} />
          </div>
        )
      case "count":
        return (
          <div className="row">
            <div className="col">
              <span className="habit-count">{props.entry?.count}</span>
            </div>
            
            <div className="col input-group">
              <button className="btn btn-secondary" onClick={() => handleUpdateCount("down")}>-</button>
              <input className="form-control" type="number" onChange={(e) => setInputNum(e.target.valueAsNumber)} value={inputNum}/>
              <button className="btn btn-secondary" onClick={() => handleUpdateCount("up")}>+</button>
            </div>
          </div>

        )
    }
  }

  return (
    <div className={`row my-4 ${props.entry?.complete ? 'habit-completed' : ''}`}>
      <div className="col">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
      <div className="col">
        {statusRender()}
      </div>
      <div>
        <button onClick={() => handleRemoveHabit(props)}>X</button>
      </div>
    </div>
  )
}

export default HabitContainer