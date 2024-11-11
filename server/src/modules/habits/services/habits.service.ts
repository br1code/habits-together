import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from '../entities/habit.entity';
import { Repository } from 'typeorm';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UpdateHabitDto } from '../dtos/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getHabits(userId: string): Promise<ReadHabitDto[]> {
    const habits = await this.habitsRepository.find({
      where: { user: { id: userId }, isDeleted: false },
    });

    return habits.map(this.toReadDto);
  }

  async createHabit(
    userId: string,
    dto: CreateHabitDto,
  ): Promise<ReadHabitDto> {
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

    return this.toReadDto(habit);
  }

  async updateHabit(
    userId: string,
    habitId: string,
    dto: UpdateHabitDto,
  ): Promise<ReadHabitDto> {
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

    return this.toReadDto(habit);
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

  private toReadDto(habit: Habit): ReadHabitDto {
    return {
      id: habit.id,
      name: habit.name,
      rules: habit.rules,
    };
  }
}
