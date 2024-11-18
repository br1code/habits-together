import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHabitLogDto {
  @IsUUID()
  @IsNotEmpty()
  habitId: string;

  @IsString()
  @IsOptional()
  text?: string;
}
