import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { ReadUserDto } from '../dtos/read-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const usersServiceMock = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return user profile successfully', async () => {
    // Arrange
    const user: AuthenticatedUser = {
      userId: 'test-user-id',
      username: 'test-user',
    };

    const userData: User = {
      id: 'test-user-id',
      username: 'test-user',
      password: 'password',
      email: 'testuser@example.com',
      profile_picture_url: 'http://example.com/profile.jpg',
      level: 1,
      experience_points: 0,
      created_at: new Date(),
      updated_at: new Date(),
      habits: [],
    };

    const expectedResult: ReadUserDto = {
      id: 'test-user-id',
      username: 'test-user',
      profilePictureUrl: 'http://example.com/profile.jpg',
    };

    jest.spyOn(usersService, 'findOne').mockResolvedValue(userData);

    // Act
    const result = await usersController.getProfile(user);

    // Assert
    expect(usersService.findOne).toHaveBeenCalledWith('test-user');
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if user not found', async () => {
    // Arrange
    const user: AuthenticatedUser = {
      userId: 'test-user-id',
      username: 'nonexistentuser',
    };

    const error = new Error('User not found');
    jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(error);

    // Act & Assert
    await expect(usersController.getProfile(user)).rejects.toThrow(
      error.message,
    );
  });
});
