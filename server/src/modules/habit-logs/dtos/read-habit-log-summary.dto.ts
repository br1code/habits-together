export class ReadHabitLogSummaryDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  userProfilePictureUrl: string | null;
  photoUrl: string;
  createdAt: string;
  validatedBy: {
    userId: string;
    username: string;
    userProfilePictureUrl: string | null;
    validatedAt: string;
  }[];
}
