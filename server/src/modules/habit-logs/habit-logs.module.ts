import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../habits/entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';
import { HabitLogsController } from './controllers/habit-logs.controller';
import { HabitLogsService } from './services/habit-logs.service';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { HabitLogValidation } from './entities/habit-log-validation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitLog, HabitLogValidation]),
    FileStorageModule,
  ],
  exports: [TypeOrmModule],
  providers: [HabitLogsService],
  controllers: [HabitLogsController],
})
export class HabitLogsModule {}
