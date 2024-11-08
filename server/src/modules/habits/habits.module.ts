import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Habit } from './entities/habit.entity';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './habits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, User])],
  exports: [TypeOrmModule],
  providers: [HabitsService],
  controllers: [HabitsController],
})
export class HabitsModule {}
