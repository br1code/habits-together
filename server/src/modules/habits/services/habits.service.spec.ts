import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../entities/habit.entity';
import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  let habitsService: HabitsService;
  let habitsRepository: Repository<Habit>;

  beforeEach(async () => {
    const habitsRepositoryMock = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: habitsRepositoryMock,
        },
      ],
    }).compile();

    habitsService = module.get<HabitsService>(HabitsService);
    habitsRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
  });

  it('should return array of habits for the given user', async () => {
    // Arrange
    const userId = 'mock-user-id';
    const mockHabits = [
      { id: 'habit-1', name: 'Exercise', rules: 'At least 30 minutes' },
      { id: 'habit-2', name: 'Sleep', rules: 'At least 8 hours' },
    ];

    jest
      .spyOn(habitsRepository, 'find')
      .mockResolvedValueOnce(mockHabits as Habit[]);

    // Act
    const result = await habitsService.getHabits(userId);

    // Assert
    expect(habitsRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
    });
    expect(result).toEqual([
      { id: 'habit-1', name: 'Exercise', rules: 'At least 30 minutes' },
      { id: 'habit-2', name: 'Sleep', rules: 'At least 8 hours' },
    ]);
  });

  it('should return an empty array if no habits are found for the given user', async () => {
    // Arrange
    const userId = 'mock-user-id';
    jest.spyOn(habitsRepository, 'find').mockResolvedValueOnce([]);

    // Act
    const result = await habitsService.getHabits(userId);

    // Assert
    expect(habitsRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
    });
    expect(result).toEqual([]);
  });
});
