export class ReadHabitLogDto {
  id: string;
  habitId: string;
  habitName: string;
  userId: string;
  username: string;
  userProfilePictureUrl: string | null;
  textEntry?: string;
  photoUrl: string;
  createdAt: string;
  validatedBy: {
    userId: string;
    username: string;
    userProfilePictureUrl: string | null;
    validatedAt: string;
  }[];
  comments: {
    id: string;
    userId: string;
    username: string;
    userProfilePictureUrl: string | null;
    text: string;
    createdAt: string;
  }[];
}
