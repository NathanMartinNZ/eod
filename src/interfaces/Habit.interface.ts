export default interface Habit {
  timestamp: object;
  id: string;
  title: string;
  description: string;
  habitType: string;
  startingCount?: number;
  goalCount?: number;
  countDirection: string;
  status: {
    complete: boolean;
    count: number;
  }
}