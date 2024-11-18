import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../habits/entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitLog])],
  exports: [TypeOrmModule],
})
export class HabitLogsModule {}
