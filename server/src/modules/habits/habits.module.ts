import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Habit } from './entities/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, User])],
  exports: [TypeOrmModule],
})
export class HabitsModule {}
