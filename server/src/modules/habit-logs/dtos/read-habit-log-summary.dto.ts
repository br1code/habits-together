export class ReadHabitLogSummaryDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  photoUrl: string;
  createdAt: string;
  validatedBy: { userId: string; username: string }[];
}
