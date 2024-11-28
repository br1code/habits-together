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
  Query,
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
    @Query('userId', new ParseUUIDPipe({ optional: true })) userId?: string,
  ): Promise<ReadHabitSummaryDto[]> {
    const targetUserId = userId ? userId : user.userId;
    return this.habitsService.getHabits(targetUserId);
  }

  @Get(':id')
  getHabit(
    @Param('id', new ParseUUIDPipe()) habitId: string,
  ): Promise<ReadHabitDto> {
    return this.habitsService.getHabit(habitId);
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
