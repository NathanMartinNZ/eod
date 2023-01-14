import { useHabitStore, useHabitEntryStore } from "../store/store";
import { useState } from "react";

function HabitContainer(props: Habit) {
  // State for input number (used to increase/decrease count)
  const [inputNum, setInputNum] = useState(1);

  // Create copy of props
  const habit = { ...props };

  // Updating habit state
  const removeHabit = useHabitStore((state) => state.removeHabit);
  // Updating habit entry state
  const updateHabitEntry = useHabitEntryStore(
    (state) => state.updateHabitEntry
  );

  const handleUpdateComplete = (complete: boolean) => {
    if (!habit.entry) {
      return;
    }
    habit.entry.complete = complete;
    updateHabitEntry(habit.entry);
  };

  const handleUpdateCount = (direction: string) => {
    if (!habit.entry) {
      return;
    }
    habit.entry.count =
      direction === "up"
        ? habit.entry.count + inputNum
        : habit.entry.count - inputNum;
    // Check if count goal is met
    if (habit.countDirection === "up") {
      habit.entry.count >= habit.goalCount!
        ? (habit.entry.complete = true)
        : (habit.entry.complete = false);
    } else if (habit.countDirection === "down") {
      habit.entry.count <= habit.goalCount!
        ? (habit.entry.complete = true)
        : (habit.entry.complete = false);
    }

    updateHabitEntry(habit.entry);
  };

  const handleRemoveHabit = (habit: Habit) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this habit?"
    );
    if (confirm) {
      removeHabit(habit);
    }
  };

  const statusRender = () => {
    switch (habit.habitType) {
      case "boolean":
        return (
          <div className="col d-flex justify-content-center">
            <input
              className="habit-check form-check-input"
              style={{cursor:"pointer"}}
              type="checkbox"
              onChange={() => handleUpdateComplete(!props.entry?.complete)}
              checked={props.entry?.complete ? true : false}
            />
          </div>
        );
      case "count":
        return (
          <>
            <div className="col-12 col-md py-2 py-md-0 d-flex justify-content-center">
              <span className="habit-count">
                {props.entry?.count} / {props.goalCount}
              </span>
            </div>

            <div className="col-12 col-md py-2 py-md-0 input-group d-flex justify-content-center">
              <button
                className="btn btn-secondary"
                onClick={() => handleUpdateCount("down")}
              >
                -
              </button>
              <input
                className="form-control"
                type="number"
                onChange={(e) => setInputNum(e.target.valueAsNumber)}
                value={inputNum.toString()}
              />
              <button
                className="btn btn-secondary"
                onClick={() => handleUpdateCount("up")}
              >
                +
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`container position-relative col-xl-10 col-xxl-8 px-4 py-3 mb-4 shadow-sm rounded ${
        props.entry?.complete ? "habit-completed" : "habit-not-completed"
      }`}
    >
      <div className="row align-items-center g-lg-4 py-4">
        <div className="col-12 col-md py-2 py-md-0">
          <h2 className="h2">{props.title}</h2>
          <h6 className="h6">{props.description}</h6>
        </div>
        {statusRender()}
      </div>
      <span onClick={() => handleRemoveHabit(props)} className="position-absolute" style={{top:0, right:0}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-trash3"
          viewBox="0 0 16 16"
          style={{ cursor:"pointer", opacity:0.3, marginRight:"4px", marginTop:"2px" }}
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      </span>
    </div>
  );
}

export default HabitContainer;
