import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../habits/entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';
import { HabitLogsController } from './controllers/habit-logs.controller';
import { HabitLogsService } from './services/habit-logs.service';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitLog]), FileStorageModule],
  exports: [TypeOrmModule],
  providers: [HabitLogsService],
  controllers: [HabitLogsController],
})
export class HabitLogsModule {}
