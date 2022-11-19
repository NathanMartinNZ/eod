export default interface HabitEntry {
  user_id: string;
  timestamp: number;
  id: string;
  habit_id: string;
  complete: boolean;
  count: number;
}