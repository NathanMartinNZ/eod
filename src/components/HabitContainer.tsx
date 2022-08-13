import React from 'react'

interface Habit {
  id: number;
  title: string;
  description: string;
  habitType: string;
  status: {
    complete: boolean;
    count: number;
  }
}

function HabitContainer(props:Habit) {

  const statusRender = () => {
    switch(props.habitType) {
      case "Boolean":
        return (
          <input type="checkbox" checked={props.status.complete ? true : false} />
        )
    }
  }

  return (
    <div>
      <div>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
      <div>
        <p>{props.habitType}</p>
        {statusRender()}
      </div>
    </div>
  )
}

export default HabitContainer