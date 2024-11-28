export class ReadHabitDto {
  id: string;
  userId: string;
  name: string;
  rules: string;
  wasLoggedToday: boolean;
  wasValidatedToday: boolean;
  currentStreak: number;
  highestStreak: number;
}
