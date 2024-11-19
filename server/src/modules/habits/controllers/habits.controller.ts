import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { UpdateHabitDto } from '../dtos/update-habit.dto';
import { ReadHabitSummaryDto } from '../dtos/read-habit-summary.dto';
import { ReadHabitDto } from '../dtos/read-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getHabits(
    @GetUser() user: AuthenticatedUser,
  ): Promise<ReadHabitSummaryDto[]> {
    return this.habitsService.getHabits(user.userId);
  }

  @Get(':id')
  getHabit(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitId: string,
  ): Promise<ReadHabitDto> {
    return this.habitsService.getHabit(user.userId, habitId);
  }

  @Post()
  @HttpCode(201)
  createHabit(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateHabitDto,
  ): Promise<string> {
    return this.habitsService.createHabit(user.userId, dto);
  }

  @Put(':id')
  @HttpCode(204)
  updateHabit(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitId: string,
    @Body() dto: UpdateHabitDto,
  ) {
    return this.habitsService.updateHabit(user.userId, habitId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteHabit(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitId: string,
  ) {
    return this.habitsService.deleteHabit(user.userId, habitId);
  }
}
