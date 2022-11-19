import HabitEntry from './HabitEntry.interface'

export default interface HabitEntriesState {
  habitEntries: Array<HabitEntry>;
  setInitialState: (uid:string) => void;
  addHabitEntry: (habitEntry:HabitEntry) => void;
  updateHabitEntry: (habitEntry:HabitEntry) => void;
}