export class ReadHabitLogDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  userProfilePictureUrl: string;
  isOwner: boolean;
  textEntry?: string;
  photoUrl: string;
  createdAt: string;
  validatedBy: {
    userId: string;
    username: string;
    userProfilePictureUrl: string;
    validatedAt: string;
  }[];
  comments: {
    id: string;
    userId: string;
    username: string;
    userProfilePictureUrl: string;
    text: string;
    createdAt: string;
  }[];
}
