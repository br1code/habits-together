import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from '../entities/habit.entity';
import { Repository } from 'typeorm';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { UpdateHabitDto } from '../dtos/update-habit.dto';
import { ReadHabitSummaryDto } from '../dtos/read-habit-summary.dto';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ActivityType } from 'src/modules/users/entities/experience-log.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    private usersService: UsersService,
  ) {}

  async getHabits(userId: string): Promise<ReadHabitSummaryDto[]> {
    const today = new Date().toISOString().split('T')[0];

    const habits = await this.habitsRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.logs', 'habitLog', 'habitLog.date = :today', {
        today,
      })
      .leftJoinAndSelect(
        'habitLog.validations',
        'habitLogValidation',
        '"habitLogValidation"."validated_at"::date = :today',
        { today },
      )

      .where('habit.userId = :userId', { userId })
      .andWhere('habit.isDeleted = false')
      .getMany();

    return habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      wasLoggedToday: habit.logs.length > 0,
      wasValidatedToday: habit.logs.some((log) => log.validations.length > 0),
    }));
  }

  async getHabit(userId: string, habitId: string): Promise<ReadHabitDto> {
    const today = new Date().toISOString().split('T')[0];

    const habit = await this.habitsRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.logs', 'habitLog')
      .leftJoinAndSelect(
        'habitLog.validations',
        'habitLogValidation',
        '"habitLogValidation"."validated_at"::date = :today',
        { today },
      )
      .where('habit.id = :habitId', { habitId })
      .andWhere('habit.userId = :userId', { userId })
      .andWhere('habit.isDeleted = false')
      .orderBy('habitLog.date', 'DESC')
      .getOne();

    if (!habit) {
      throw new NotFoundException(`Habit with Id ${habitId} not found.`);
    }

    const logDates = habit.logs.map((log) =>
      log.date instanceof Date
        ? log.date.toISOString().split('T')[0]
        : log.date,
    );

    const { currentStreak, highestStreak } = this.calculateStreaks(logDates);

    return {
      id: habit.id,
      name: habit.name,
      rules: habit.rules,
      wasLoggedToday: logDates.includes(today),
      wasValidatedToday: habit.logs.some((log) => log.validations.length > 0),
      currentStreak,
      highestStreak,
    };
  }

  async createHabit(userId: string, dto: CreateHabitDto): Promise<string> {
    const habit = this.habitsRepository.create({
      name: dto.name,
      rules: dto.rules,
      user: { id: userId },
    });

    await this.habitsRepository.save(habit);

    await this.usersService.addExperience(
      userId,
      ActivityType.HABIT_CREATION,
      habit.id,
    );

    return habit.id;
  }

  async updateHabit(userId: string, habitId: string, dto: UpdateHabitDto) {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId, isDeleted: false },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit with id ${habitId} not found.`);
    }

    if (habit.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to update this habit.`,
      );
    }

    habit.name = dto.name;
    habit.rules = dto.rules;

    await this.habitsRepository.save(habit);
  }

  async deleteHabit(userId: string, habitId: string): Promise<void> {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId, isDeleted: false },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit with id ${habitId} not found.`);
    }

    if (habit.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to delete this habit.`,
      );
    }

    habit.isDeleted = true;

    await this.habitsRepository.save(habit);
  }

  private calculateStreaks(logDates: string[]): {
    currentStreak: number;
    highestStreak: number;
  } {
    if (!logDates.length) return { currentStreak: 0, highestStreak: 0 };

    let currentStreak = 0;
    let highestStreak = 0;
    let streakCount = 1;

    // Normalize dates and sort them in ascending order
    const dates = logDates
      .map((date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());

    // Calculate streaks
    for (let i = 1; i < dates.length; i++) {
      const diff =
        (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24); // Difference in days

      if (diff === 1) {
        // Consecutive days
        streakCount++;
      } else {
        // Break in streak
        highestStreak = Math.max(highestStreak, streakCount);
        streakCount = 1;
      }
    }

    // Finalize highest streak
    highestStreak = Math.max(highestStreak, streakCount);

    // Calculate current streak
    const today = new Date().toISOString().split('T')[0];
    const mostRecentLog = dates[dates.length - 1].toISOString().split('T')[0];

    if (mostRecentLog === today) {
      currentStreak = streakCount;
    }

    return { currentStreak, highestStreak };
  }
}
