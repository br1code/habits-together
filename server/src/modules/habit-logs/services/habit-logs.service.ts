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
import { ReadHabitLogsQueryDto } from '../dtos/read-habit-logs-query.dto';
import { ReadHabitLogSummaryDto } from '../dtos/read-habit-log-summary.dto';
import { CreateHabitLogCommentDto } from '../dtos/create-habit-log-comment.dto';
import { HabitLogComment } from '../entities/habit-log-comment.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { ActivityType } from 'src/modules/users/entities/experience-log.entity';
import { formatDateForDisplay, getCurrentDateISO } from 'src/utils/dateUtils';

@Injectable()
export class HabitLogsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private readonly habitLogsRepository: Repository<HabitLog>,
    @InjectRepository(HabitLogValidation)
    private readonly habitLogValidationsRepository: Repository<HabitLogValidation>,
    @InjectRepository(HabitLogComment)
    private readonly habitLogCommentsRepository: Repository<HabitLogComment>,
    @Inject(FILE_STORAGE_PROVIDER)
    private readonly fileStorageProvider: FileStorageProvider,
    private usersService: UsersService,
  ) {}

  async getHabitLogs(
    userId: string,
    query: ReadHabitLogsQueryDto,
  ): Promise<ReadHabitLogSummaryDto[]> {
    const queryBuilder = this.habitLogsRepository
      .createQueryBuilder('habitLog')
      .leftJoinAndSelect('habitLog.habit', 'habit')
      .leftJoinAndSelect('habit.user', 'habitOwner')
      .leftJoinAndSelect('habitLog.validations', 'validation')
      .leftJoinAndSelect('validation.validatorUser', 'validatorUser')
      .where('habit.isDeleted = false')
      .orderBy('habitLog.created_at', 'DESC');

    if (query.habitId) {
      queryBuilder.andWhere('habitLog.habitId = :habitId', {
        habitId: query.habitId,
      });
    }

    const logs = await queryBuilder
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return logs.map((log) => ({
      id: log.id,
      habitId: log.habit.id,
      habitName: log.habit.name,
      userId: log.habit.user.id,
      username: log.habit.user.username,
      userProfilePictureUrl: log.habit.user.profile_picture_url,
      isOwner: userId === log.habit.user.id,
      photoUrl: log.photo_url,
      createdAt: formatDateForDisplay(log.created_at),
      validatedBy: log.validations.map((validation) => ({
        userId: validation.validatorUser.id,
        username: validation.validatorUser.username,
      })),
    }));
  }

  async createHabitLog(
    userId: string,
    dto: CreateHabitLogDto,
    photo: Express.Multer.File,
  ): Promise<string> {
    const habit = await this.habitsRepository.findOneBy({
      id: dto.habitId,
      isDeleted: false,
      user: { id: userId },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with Id ${dto.habitId} not found.`);
    }

    const today = getCurrentDateISO();

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

    // TODO: consider deleting photo if the following code fails
    const { url: photoUrl } = await this.fileStorageProvider.upload(photo);

    const habitLog = this.habitLogsRepository.create({
      date: today,
      text_entry: dto.text,
      photo_url: photoUrl,
      habit: habit,
    });

    await this.habitLogsRepository.save(habitLog);

    await this.usersService.addExperience(
      userId,
      ActivityType.HABIT_LOG_CREATION,
      habitLog.id,
    );

    return habitLog.id;
  }

  async getHabitLog(
    userId: string,
    habitLogId: string,
  ): Promise<ReadHabitLogDto> {
    const habitLog = await this.habitLogsRepository.findOne({
      where: { id: habitLogId },
      relations: [
        'habit',
        'habit.user',
        'validations',
        'validations.validatorUser',
        'comments',
        'comments.user',
      ],
    });

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    if (!habitLog.habit || habitLog.habit.isDeleted) {
      throw new NotFoundException(`Habit not found.`);
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
      createdAt: formatDateForDisplay(habitLog.created_at),
      validatedBy: habitLog.validations.map((validation) => ({
        userId: validation.validatorUser.id,
        username: validation.validatorUser.username,
      })),
      comments: habitLog.comments.map((comment) => ({
        id: comment.id,
        userId: comment.user.id,
        username: comment.user.username,
        text: comment.text,
        createdAt: formatDateForDisplay(comment.created_at),
      })),
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

    if (!habitLog.habit || habitLog.habit.isDeleted) {
      throw new NotFoundException(`Habit not found.`);
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

    if (!habitLog.habit || habitLog.habit.isDeleted) {
      throw new NotFoundException(`Habit not found.`);
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

    await this.usersService.addExperience(
      userId,
      ActivityType.HABIT_LOG_VALIDATION_PERFORMED,
      habitLog.id,
    );

    await this.usersService.addExperience(
      habitLog.habit.user.id,
      ActivityType.HABIT_LOG_VALIDATION_RECEIVED,
      habitLog.id,
    );
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

    if (!habitLog.habit || habitLog.habit.isDeleted) {
      throw new NotFoundException(`Habit not found.`);
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

  async addComment(
    userId: string,
    habitLogId: string,
    dto: CreateHabitLogCommentDto,
  ) {
    const habitLog = await this.habitLogsRepository
      .createQueryBuilder('habitLog')
      .leftJoinAndSelect('habitLog.habit', 'habit')
      .where('habitLog.id = :habitLogId', { habitLogId })
      .andWhere('habit.isDeleted = false')
      .getOne();

    if (!habitLog) {
      throw new NotFoundException(
        `Habit Log with Id ${habitLogId} was not found.`,
      );
    }

    const comment = this.habitLogCommentsRepository.create({
      habitLog: habitLog,
      user: { id: userId },
      text: dto.text,
    });

    await this.habitLogCommentsRepository.save(comment);
  }

  async removeComment(userId: string, habitLogId: string, commentId: string) {
    const comment = await this.habitLogCommentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.habitLog', 'habitLog')
      .leftJoinAndSelect('habitLog.habit', 'habit')
      .where('comment.id = :commentId', { commentId })
      .andWhere('habitLog.id = :habitLogId', { habitLogId })
      .andWhere('comment.user.id = :userId', { userId })
      .andWhere('habit.isDeleted = false')
      .getOne();

    if (!comment) {
      throw new UnauthorizedException(
        `This comment doesn't exist or you are not authorized to remove it.`,
      );
    }

    await this.habitLogCommentsRepository.remove(comment);
  }
}
