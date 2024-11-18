import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';

// TODO: write tests
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // TODO: stop using `any`
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<string> {
    const { username, email, password } = createUserDto;

    // Check if username or email already exists
    try {
      const existingUser = await this.usersService.findOne(username);
      const existingEmail = await this.usersService.findByEmail(email);

      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }

      if (existingEmail) {
        throw new BadRequestException('Email already registered');
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        console.error('An unexpected error occurred:', error);
        throw error;
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Exclude password from the returned user object
    return user.id;
  }
}
