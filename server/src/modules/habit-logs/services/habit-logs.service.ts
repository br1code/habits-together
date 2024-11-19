import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog } from '../entities/habit-log.entity';
import { Raw, Repository } from 'typeorm';
import { CreateHabitLogDto } from '../dtos/create-habit-log.dto';
import { Habit } from 'src/modules/habits/entities/habit.entity';
import {
  FILE_STORAGE_PROVIDER,
  FileStorageProvider,
} from 'src/modules/file-storage/interfaces/file-storage.interface';
import { ReadHabitLogDto } from '../dtos/read-habit-log.dto';
import { HabitLogValidation } from '../entities/habit-log-validation.entity';

@Injectable()
export class HabitLogsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private readonly habitLogsRepository: Repository<HabitLog>,
    @InjectRepository(HabitLogValidation)
    private readonly habitLogValidationsRepository: Repository<HabitLogValidation>,
    @Inject(FILE_STORAGE_PROVIDER)
    private readonly fileStorageProvider: FileStorageProvider,
  ) {}

  async createHabitLog(
    dto: CreateHabitLogDto,
    photo: Express.Multer.File,
  ): Promise<string> {
    const habit = await this.habitsRepository.findOneBy({
      id: dto.habitId,
      isDeleted: false,
    });

    if (!habit) {
      throw new NotFoundException(`Habit with Id ${dto.habitId} not found.`);
    }

    // TODO: get current date from somewhere else (library?)
    const today = new Date().toISOString().split('T')[0];

    const existingLog = await this.habitLogsRepository.findOne({
      where: {
        habit: { id: dto.habitId },
        date: Raw((alias) => `${alias} = :today`, { today }),
      },
    });

    if (existingLog) {
      throw new ConflictException(
        'A habit log already exists for this habit and date.',
      );
    }

    const { url: photoUrl } = await this.fileStorageProvider.upload(photo);

    const habitLog = this.habitLogsRepository.create({
      date: today,
      text_entry: dto.text,
      photo_url: photoUrl,
      habit: habit,
    });

    await this.habitLogsRepository.save(habitLog);

    return habitLog.id;
  }

  async getHabitLog(
    userId: string,
    habitLogId: string,
  ): Promise<ReadHabitLogDto> {
    const habitLog = await this.habitLogsRepository.findOne({
      where: { id: habitLogId },
      relations: ['habit', 'habit.user'],
    });

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    return {
      id: habitLog.id,
      userId: habitLog.habit.user.id,
      username: habitLog.habit.user.username,
      isOwner: userId === habitLog.habit.user.id,
      habitId: habitLog.habit.id,
      habitName: habitLog.habit.name,
      textEntry: habitLog.text_entry,
      photoUrl: habitLog.photo_url,
      createdAt: habitLog.created_at.toISOString(),
      validatedBy: [], // TODO: update after implementing Habit Log Validation
    };
  }

  async deleteHabitLog(userId: string, habitLogId: string): Promise<void> {
    const habitLog = await this.habitLogsRepository.findOne({
      where: { id: habitLogId },
      relations: ['habit', 'habit.user'],
    });

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    if (habitLog.habit.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to delete this habit.`,
      );
    }

    await this.habitLogsRepository.remove(habitLog);
  }

  async validateHabitLog(userId: string, habitLogId: string): Promise<void> {
    const habitLog = await this.habitLogsRepository.findOne({
      where: { id: habitLogId },
      relations: [
        'habit',
        'habit.user',
        'validations',
        'validations.validatorUser',
      ],
    });

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    if (habitLog.habit.user.id === userId) {
      throw new UnauthorizedException(
        `You are not authorized to validate this Habit Log.`,
      );
    }

    const existingValidation = habitLog.validations.find(
      (validation) => validation.validatorUser.id === userId,
    );

    if (existingValidation) {
      throw new ConflictException('User has already validated this Habit Log.');
    }

    const habitLogValidation = this.habitLogValidationsRepository.create({
      habitLog: habitLog,
      validatorUser: { id: userId },
    });

    await this.habitLogValidationsRepository.save(habitLogValidation);
  }

  async invalidateHabitLog(userId: string, habitLogId: string): Promise<void> {
    const habitLog = await this.habitLogsRepository.findOne({
      where: { id: habitLogId },
      relations: [
        'habit',
        'habit.user',
        'validations',
        'validations.validatorUser',
      ],
    });

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    if (habitLog.habit.user.id === userId) {
      throw new UnauthorizedException(
        `You are not authorized to invalidate this Habit Log.`,
      );
    }

    const existingValidation = habitLog.validations.find(
      (validation) => validation.validatorUser.id === userId,
    );

    if (!existingValidation) {
      throw new NotFoundException(
        'Validation by the user for this Habit Log was not found.',
      );
    }

    await this.habitLogValidationsRepository.remove(existingValidation);
  }
}
