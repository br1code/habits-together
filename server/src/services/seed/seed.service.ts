import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Habit } from 'src/modules/habits/entities/habit.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async seedDatabase() {
    try {
      console.log('Starting database seed ...');

      await this.createUsers();
      await this.createHabits();

      console.log('Finished database seed.');
    } catch (error) {
      console.error(
        `Failed to seed database. Error: ${(error as Error)?.message}`,
      );
    }
  }

  async createUsers() {
    const existingUsers = await this.usersRepository.count();

    if (existingUsers > 0) {
      console.log('Skipping Users.');
      return;
    }

    const users: Partial<User>[] = [
      {
        username: 'admin',
        email: 'brunogiovagnoli@gmail.com',
        password: 'password123', // TODO: encrypt
      },
      {
        username: 'cassie',
        email: 'cassiegiovagnoli@gmail.com',
        password: 'password123', // TODO: encrypt
      },
    ];

    for (const userData of users) {
      const user = this.usersRepository.create(userData);
      await this.usersRepository.save(user);
    }

    console.log(`Users created: ${users.length}`);
  }

  async createHabits() {
    const existingHabits = await this.habitsRepository.count();

    if (existingHabits > 0) {
      console.log('Skipping Habits.');
      return;
    }

    const user = await this.usersRepository.findOneByOrFail({
      username: 'admin',
    });

    const habits: Partial<Habit>[] = [
      {
        name: 'Exercise',
        rules: 'At least 30 minutes of exercise',
        user: user,
      },
      {
        name: 'Sufficient Sleep',
        rules: 'At least 8 hours of sleep',
        user: user,
      },
    ];

    for (const habitData of habits) {
      const habit = this.habitsRepository.create(habitData);
      await this.habitsRepository.save(habit);
    }

    console.log(`Habits created: ${habits.length}`);
  }
}
