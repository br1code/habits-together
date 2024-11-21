import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Habit } from '../habits/entities/habit.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ExperienceLog } from './entities/experience-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Habit, ExperienceLog])],
  exports: [UsersService, TypeOrmModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
