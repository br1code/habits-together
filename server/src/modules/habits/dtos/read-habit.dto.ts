export class ReadHabitDto {
  id: string;
  name: string;
  rules: string;
  wasLoggedToday: boolean;
  wasValidatedToday: boolean;
  currentStreak: number;
  highestStreak: number;
}
