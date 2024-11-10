import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

// TODO: fix/finish these tests
describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const usersRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepositoryMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return a user when it exists', async () => {
    // Arrange
    const username = 'test-user';
    const mockUser = new User();
    mockUser.id = 'test-user-id';
    mockUser.username = username;

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

    // Act
    const result = await usersService.findOne(username);

    // Assert
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { username },
    });
    expect(result).toEqual(mockUser);
  });

  it('shoul fail when user is not found', async () => {
    // Arrange
    const username = 'nonexistentuser';

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

    // Act & Assert
    await expect(usersService.findOne(username)).rejects.toThrow(
      NotFoundException,
    );
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { username },
    });
  });
});
