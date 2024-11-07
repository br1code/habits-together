import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from './seed.service';
import { User } from 'src/modules/users/entities/user.entity';

describe('SeedService', () => {
  let seedService: SeedService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const repositoryMock = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useValue: repositoryMock },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('seedDatabase', () => {
    it('should log starting and finishing messages', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(seedService, 'createUsers').mockResolvedValueOnce(undefined);

      await seedService.seedDatabase();

      expect(consoleLogSpy).toHaveBeenCalledWith('Starting database seed ...');
      expect(consoleLogSpy).toHaveBeenCalledWith('Finished database seed.');
    });

    it('should log an error message if seeding fails', async () => {
      const error = new Error('Seeding error');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(seedService, 'createUsers').mockRejectedValueOnce(error);

      await seedService.seedDatabase();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to seed database. Error: ${error.message}`,
      );
    });
  });

  describe('createUsers', () => {
    it('should skip creating users if they already exist', async () => {
      jest.spyOn(usersRepository, 'count').mockResolvedValueOnce(1);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await seedService.createUsers();

      expect(consoleLogSpy).toHaveBeenCalledWith('Skipping Users.');
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should create users if none exist', async () => {
      jest.spyOn(usersRepository, 'count').mockResolvedValueOnce(0);
      jest
        .spyOn(usersRepository, 'create')
        .mockImplementation((user) => user as User);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(undefined as any);

      await seedService.createUsers();

      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });
});
