import useHabitStore from '../store/store';
import { useState } from 'react'
import Habit from '../interfaces/Habit.interface'

function HabitContainer(props:Habit) {
  // State for input number (used to increase/decrease count)
  const [inputNum, setInputNum] = useState(1)

  // Create copy of props
  const habit = {...props}

  // Updating habit state
  const updateHabit = useHabitStore((state) => state.updateHabit)

  const updateComplete = (complete:boolean) => {
    habit.status.complete = complete
    updateHabit(habit)
  }

  const updateCount = (direction:string) => {
    habit.status.count = (direction === "up" ? habit.status.count + inputNum : habit.status.count - inputNum)

    // Check if count goal is met
    if(habit.countDirection === "up") {
      habit.status.count >= habit.goalCount! ? habit.status.complete = true : habit.status.complete = false
    } else if(habit.countDirection === "down") {
      habit.status.count <= habit.goalCount! ? habit.status.complete = true : habit.status.complete = false
    }

    updateHabit(habit)
  }

  const statusRender = () => {
    switch(habit.habitType) {
      case "boolean":
        return (
          <div className="col">
            <input className="habit-check form-check-input" type="checkbox" onChange={() => updateComplete(!props.status.complete)} checked={props.status.complete ? true : false} />
          </div>
        )
      case "count":
        return (
          <div className="row">
            <div className="col">
              <span className="habit-count">{props.status.count}</span>
            </div>
            
            <div className="col input-group">
              <button className="btn btn-secondary" onClick={() => updateCount("down")}>-</button>
              <input className="form-control" type="number" onChange={(e) => setInputNum(e.target.valueAsNumber)} value={inputNum}/>
              <button className="btn btn-secondary" onClick={() => updateCount("up")}>+</button>
            </div>
          </div>

        )
    }
  }

  return (
    <div className={`row my-4 ${props.status.complete ? 'habit-completed' : ''}`}>
      <div className="col">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
      <div className="col">
        {statusRender()}
      </div>
    </div>
  )
}

export default HabitContainer