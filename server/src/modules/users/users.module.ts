import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Habit } from '../habits/entities/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Habit])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
