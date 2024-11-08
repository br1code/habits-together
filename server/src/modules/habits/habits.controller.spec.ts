import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './services/habits.service';
import { ReadHabitDto } from './dtos/read-habit.dto';

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
    const userId = 'user-id'; // TODO: update after implementing auth middleware
    const getHabitsSpy = jest
      .spyOn(habitsService, 'getHabits')
      .mockResolvedValue([]);

    // Act
    await habitsController.getHabits();

    // Assert
    expect(getHabitsSpy).toHaveBeenCalledWith(userId);
  });

  it('should return an array of habits from getHabits', async () => {
    // Arrange
    const mockHabits: ReadHabitDto[] = [
      { id: '1', name: 'Exercise', rules: 'At least 30 minutes' },
      { id: '2', name: 'Read', rules: 'At least 20 pages' },
    ];
    jest.spyOn(habitsService, 'getHabits').mockResolvedValue(mockHabits);

    // Act
    const result = await habitsController.getHabits();

    // Assert
    expect(result).toEqual(mockHabits);
  });

  it('should handle errors thrown by HabitsService.getHabits', async () => {
    // Arrange
    const error = new Error('Failed to fetch habits');
    jest.spyOn(habitsService, 'getHabits').mockRejectedValue(error);

    // Act & Assert
    await expect(habitsController.getHabits()).rejects.toThrow(error.message);
  });
});
