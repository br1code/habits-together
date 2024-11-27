import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class ReadExperienceLogQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
