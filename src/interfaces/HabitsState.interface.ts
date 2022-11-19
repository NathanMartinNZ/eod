import Habit from './Habit.interface'

export default interface HabitsState {
  habits: Array<Habit>;
  setInitialState: () => void;
  addHabit: (habit:Habit) => void;
  removeHabit: (habit:Habit) => void;
}