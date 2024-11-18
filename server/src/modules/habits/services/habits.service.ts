import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from '../entities/habit.entity';
import { Repository } from 'typeorm';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UpdateHabitDto } from '../dtos/update-habit.dto';
import { ReadHabitSummaryDto } from '../dtos/read-habit-summary.dto';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { HabitLog } from 'src/modules/habit-logs/entities/habit-log.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private readonly habitLogsRepository: Repository<HabitLog>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getHabits(userId: string): Promise<ReadHabitSummaryDto[]> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const habits = await this.habitsRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.logs', 'habitLog', 'habitLog.date = :today', {
        today,
      })
      .where('habit.userId = :userId', { userId })
      .andWhere('habit.isDeleted = false')
      .getMany();

    console.log(habits);

    return habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      wasLoggedToday: habit.logs.length > 0,
      wasValidatedToday: false, // TODO: update after implementing Habit Log Validation
    }));
  }

  async getHabit(userId: string, habitId: string): Promise<ReadHabitDto> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const habit = await this.habitsRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.logs', 'habitLog', 'habitLog.date = :today', {
        today,
      })
      .where('habit.id = :habitId', { habitId })
      .andWhere('habit.userId = :userId', { userId })
      .andWhere('habit.isDeleted = false')
      .getOne();

    if (!habit) {
      throw new NotFoundException(`Habit with Id ${habitId} not found.`);
    }

    return {
      id: habit.id,
      name: habit.name,
      rules: habit.rules,
      wasLoggedToday: habit.logs.length > 0,
      wasValidatedToday: false, // TODO: update after implementing Habit Log Validation
      currentStreak: 0, // TODO: update after implementing streaks
      highestStreak: 0, // TODO: update after implementing streaks
    };
  }

  async createHabit(userId: string, dto: CreateHabitDto): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with Id ${userId} not found.`);
    }

    const habit = this.habitsRepository.create({
      name: dto.name,
      rules: dto.rules,
      user: user,
    });

    await this.habitsRepository.save(habit);

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
}
