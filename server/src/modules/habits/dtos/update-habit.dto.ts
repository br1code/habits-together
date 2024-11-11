import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHabitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  rules: string;
}
