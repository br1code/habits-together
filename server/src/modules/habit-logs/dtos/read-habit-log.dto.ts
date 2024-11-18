export class ReadHabitLogDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  isOwner: boolean;
  textEntry?: string;
  photoUrl: string;
  createdAt: string;
  validatedBy: { userId: string; username: string }[];
}