import Habit from './Habit.interface'

export default interface HabitsState {
  habits: Array<Habit>;
  setInitialState: () => void;
  addHabit: (newHabit:Habit) => void;
  updateHabit: (habit:Habit) => void;
}