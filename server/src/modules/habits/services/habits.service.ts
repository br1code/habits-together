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

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getHabits(userId: string): Promise<ReadHabitSummaryDto[]> {
    const habits = await this.habitsRepository.find({
      where: { user: { id: userId }, isDeleted: false },
    });

    return habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      wasLoggedToday: false, // TODO: update after implementing Habit Log
      wasValidatedToday: false, // TODO: update after implementing Habit Log Validation
    }));
  }

  async getHabit(userId: string, habitId: string): Promise<ReadHabitDto> {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId, user: { id: userId }, isDeleted: false },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with Id ${habitId} not found.`);
    }

    return {
      id: habit.id,
      name: habit.name,
      rules: habit.rules,
      wasLoggedToday: false, // TODO: update after implementing Habit Log
      wasValidatedToday: false, // TODO: update after implementing Habit Log
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
