import Habit from './Habit.interface'

export default interface HabitsState {
  habits: Array<Habit>;
  setInitialState: (habits:Habit[]) => void;
  addHabit: (newHabit:Habit) => void;
  updateHabit: (habit:Habit) => void;
}