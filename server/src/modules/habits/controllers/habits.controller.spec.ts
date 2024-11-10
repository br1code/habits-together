import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { ReadHabitDto } from '../dtos/read-habit.dto';
import { HabitsService } from '../services/habits.service';

describe('HabitsController', () => {
  let habitsController: HabitsController;
  let habitsService: HabitsService;

  beforeEach(async () => {
    const habitsServiceMock = {
      getHabits: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: habitsServiceMock,
        },
      ],
    }).compile();

    habitsController = module.get<HabitsController>(HabitsController);
    habitsService = module.get<HabitsService>(HabitsService);
  });

  it('should call HabitsService.getHabits with the correct user ID', async () => {
    // Arrange
    const user = { userId: 'test-user-id', username: 'test-user' };
    const getHabitsSpy = jest
      .spyOn(habitsService, 'getHabits')
      .mockResolvedValue([]);

    // Act
    await habitsController.getHabits(user);

    // Assert
    expect(getHabitsSpy).toHaveBeenCalledWith(user.userId);
  });

  it('should return an array of habits from getHabits', async () => {
    // Arrange
    const user = { userId: 'test-user-id', username: 'test-user' };
    const mockHabits: ReadHabitDto[] = [
      { id: '1', name: 'Exercise', rules: 'At least 30 minutes' },
      { id: '2', name: 'Read', rules: 'At least 20 pages' },
    ];
    jest.spyOn(habitsService, 'getHabits').mockResolvedValue(mockHabits);

    // Act
    const result = await habitsController.getHabits(user);

    // Assert
    expect(result).toEqual(mockHabits);
  });

  it('should handle errors thrown by HabitsService.getHabits', async () => {
    // Arrange
    const user = { userId: 'test-user-id', username: 'test-user' };
    const error = new Error('Failed to fetch habits');
    jest.spyOn(habitsService, 'getHabits').mockRejectedValue(error);

    // Act & Assert
    await expect(habitsController.getHabits(user)).rejects.toThrow(
      error.message,
    );
  });
});
