// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // TODO: can we move this logic to somewhere else? (authService?)
  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    // Check if username or email already exists
    const existingUser = await this.usersService.findOne(username);
    const existingEmail = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Exclude password from the returned user object
    const { password: _, ...result } = user;
    return result;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
