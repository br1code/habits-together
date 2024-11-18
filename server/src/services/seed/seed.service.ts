import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { Habit } from 'src/modules/habits/entities/habit.entity';
import { HabitLog } from 'src/modules/habit-logs/entities/habit-log.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private readonly habitLogsRepository: Repository<HabitLog>,
  ) {}

  async seedDatabase() {
    try {
      console.log('Starting database seed ...');

      await this.createUsers();
      await this.createHabits();
      await this.createHabitLogs();

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
        password: 'password123', // Plain text password
      },
      {
        username: 'cassie',
        email: 'cassiegiovagnoli@gmail.com',
        password: 'password123', // Plain text password
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

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

  async createHabitLogs() {
    const existingLogs = await this.habitLogsRepository.count();

    if (existingLogs > 0) {
      console.log('Skipping HabitLogs.');
      return;
    }

    const habit = await this.habitsRepository.findOneByOrFail({
      name: 'Exercise',
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const logs: Partial<HabitLog>[] = [
      {
        habit: habit,
        date: today,
        text_entry: 'Morning run',
        photo_url: 'http://example.com/photo1.jpg',
      },
      {
        habit: habit,
        date: yesterday,
        text_entry: '8-hour sleep achieved',
        photo_url: 'http://example.com/photo2.jpg',
      },
    ];

    for (const logData of logs) {
      const log = this.habitLogsRepository.create(logData);
      await this.habitLogsRepository.save(log);
    }

    console.log(`HabitLogs created: ${logs.length}`);
  }
}
