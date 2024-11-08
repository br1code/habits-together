import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from '../entities/habit.entity';
import { Repository } from 'typeorm';
import { ReadHabitDto } from '../dtos/read-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async getHabits(userId: string): Promise<ReadHabitDto[]> {
    const habits = await this.habitsRepository.find({
      where: { user: { id: userId } },
    });

    return habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      rules: habit.rules,
    }));
  }
}
