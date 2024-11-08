import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from './seed.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Habit } from 'src/modules/habits/entities/habit.entity';

describe('SeedService', () => {
  let seedService: SeedService;
  let usersRepository: Repository<User>;
  let habitsRepository: Repository<Habit>;

  beforeEach(async () => {
    const usersRepositoryMock = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOneByOrFail: jest.fn(),
    };

    const habitsRepositoryMock = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useValue: usersRepositoryMock },
        { provide: getRepositoryToken(Habit), useValue: habitsRepositoryMock },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    habitsRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
  });

  describe('seedDatabase', () => {
    it('should log status messages and call methods for creating entities', async () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const createUsersSpy = jest
        .spyOn(seedService, 'createUsers')
        .mockResolvedValueOnce(undefined);
      const createHabitsSpy = jest
        .spyOn(seedService, 'createHabits')
        .mockResolvedValueOnce(undefined);

      // Act
      await seedService.seedDatabase();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Starting database seed ...');
      expect(createUsersSpy).toHaveBeenCalled();
      expect(createHabitsSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Finished database seed.');
    });

    it('should log an error message if seeding fails', async () => {
      // Arrange
      const error = new Error('Seeding error');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(seedService, 'createUsers').mockRejectedValueOnce(error);

      // Act
      await seedService.seedDatabase();

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to seed database. Error: ${error.message}`,
      );
    });
  });

  describe('createUsers', () => {
    it('should skip creating users if some already exist', async () => {
      // Arrange
      jest.spyOn(usersRepository, 'count').mockResolvedValueOnce(1);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await seedService.createUsers();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Skipping Users.');
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should create users if none exist', async () => {
      // Arrange
      jest.spyOn(usersRepository, 'count').mockResolvedValueOnce(0);
      jest
        .spyOn(usersRepository, 'create')
        .mockImplementation((user) => user as User);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(undefined as any);

      // Act
      await seedService.createUsers();

      // Assert
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });

  describe('createHabits', () => {
    it('should skip creating habits if some already exist', async () => {
      // Arrange
      jest.spyOn(habitsRepository, 'count').mockResolvedValueOnce(1);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await seedService.createHabits();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Skipping Habits.');
      expect(habitsRepository.create).not.toHaveBeenCalled();
      expect(habitsRepository.save).not.toHaveBeenCalled();
    });

    it('should create habits if none exist', async () => {
      // Arrange
      jest.spyOn(habitsRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(usersRepository, 'findOneByOrFail').mockResolvedValueOnce({
        username: 'admin',
      } as User);
      jest
        .spyOn(habitsRepository, 'create')
        .mockImplementation((habit) => habit as Habit);
      jest.spyOn(habitsRepository, 'save').mockResolvedValue(undefined as any);

      // Act
      await seedService.createHabits();

      // Assert
      expect(habitsRepository.create).toHaveBeenCalled();
      expect(habitsRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if the admin user is not found', async () => {
      // Arrange
      jest.spyOn(habitsRepository, 'count').mockResolvedValueOnce(0);
      const error = new Error('User not found');
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(error);

      // Act & Assert
      await expect(seedService.createHabits()).rejects.toThrow(error.message);
      expect(habitsRepository.create).not.toHaveBeenCalled();
      expect(habitsRepository.save).not.toHaveBeenCalled();
    });
  });
});
