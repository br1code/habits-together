import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { UsersService } from '../services/users.service';
import { ReadUserDto } from '../dtos/read-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@GetUser() user: AuthenticatedUser) {
    const userData = await this.usersService.findOne(user.username);
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      profile_picture_url: userData.profile_picture_url,
    } as ReadUserDto;
  }
}
