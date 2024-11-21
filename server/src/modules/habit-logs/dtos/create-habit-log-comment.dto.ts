import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHabitLogCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
