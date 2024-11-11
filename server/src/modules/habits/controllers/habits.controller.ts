import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { UpdateHabitDto } from '../dtos/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getHabits(@GetUser() user: AuthenticatedUser): Promise<ReadHabitDto[]> {
    return this.habitsService.getHabits(user.userId);
  }

  @Post()
  createHabit(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateHabitDto,
  ): Promise<ReadHabitDto> {
    return this.habitsService.createHabit(user.userId, dto);
  }

  @Put(':id')
  updateHabit(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitId: string,
    @Body() dto: UpdateHabitDto,
  ): Promise<ReadHabitDto> {
    return this.habitsService.updateHabit(user.userId, habitId, dto);
  }

  @Delete(':id')
  deleteHabit(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitId: string,
  ): Promise<void> {
    return this.habitsService.deleteHabit(user.userId, habitId);
  }
}
