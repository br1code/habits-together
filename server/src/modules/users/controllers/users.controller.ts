import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { UsersService } from '../services/users.service';
import { ReadUserDto } from '../dtos/read-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@GetUser() user: AuthenticatedUser): Promise<ReadUserDto> {
    return this.usersService.getUserProfile(user.userId);
  }

  @Get('friends')
  getFriends(@GetUser() user: AuthenticatedUser): Promise<ReadUserDto[]> {
    return this.usersService.getFriendsProfiles(user.userId);
  }

  @Get('friends/:id')
  getFriend(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) friendId: string,
  ): Promise<ReadUserDto> {
    return this.usersService.getFriendProfile(user.userId, friendId);
  }
}
