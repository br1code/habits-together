import { Controller, Get } from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getHabits(@GetUser() user: AuthenticatedUser): Promise<ReadHabitDto[]> {
    return this.habitsService.getHabits(user.userId);
  }
}
