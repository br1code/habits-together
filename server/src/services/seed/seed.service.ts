import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async seedDatabase() {
    try {
      console.log('Starting database seed ...');

      await this.createUsers();

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
}
