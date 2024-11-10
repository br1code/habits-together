import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/modules/users/services/users.service';

// TODO: write tests
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
    };
    const usersServiceMock = {
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });
});
