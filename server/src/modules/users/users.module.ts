import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Habit } from '../habits/entities/habit.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Habit])],
  exports: [UsersService, TypeOrmModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
