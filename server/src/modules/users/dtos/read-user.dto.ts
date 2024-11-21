export class ReadUserDto {
  id: string;
  username: string;
  profilePictureUrl?: string;
  level: number;
  currentExperiencePoints: number;
  requiredExperiencePoints: number;
}
