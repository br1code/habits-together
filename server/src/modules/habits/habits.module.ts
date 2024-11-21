import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Habit } from './entities/habit.entity';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './controllers/habits.controller';
import { HabitLog } from '../habit-logs/entities/habit-log.entity';
import { HabitLogValidation } from '../habit-logs/entities/habit-log-validation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitLog, HabitLogValidation, User]),
    UsersModule,
  ],
  exports: [TypeOrmModule],
  providers: [HabitsService],
  controllers: [HabitsController],
})
export class HabitsModule {}
