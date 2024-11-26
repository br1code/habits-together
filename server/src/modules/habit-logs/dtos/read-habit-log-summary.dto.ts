export class ReadHabitLogSummaryDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  userProfilePictureUrl: string;
  isOwner: boolean;
  photoUrl: string;
  createdAt: string;
  validatedBy: {
    // TODO: I think this is not being used, can we remove it?
    userId: string;
    username: string;
    userProfilePictureUrl: string;
    validatedAt: string;
  }[];
}
