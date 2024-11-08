import { Controller, Get } from '@nestjs/common';
import { HabitsService } from './services/habits.service';
import { ReadHabitDto } from './dtos/read-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getHabits(): Promise<ReadHabitDto[]> {
    const userId = 'user-id'; // TODO: after implementing auth middleware, replace with `req.user.id`
    return this.habitsService.getHabits(userId);
  }
}
