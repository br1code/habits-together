export class ReadHabitLogSummaryDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  isOwner: boolean;
  photoUrl: string;
  createdAt: string;
  validatedBy: { userId: string; username: string }[];
}
