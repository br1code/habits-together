import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { UsersService } from '../services/users.service';
import { ReadUserDto } from '../dtos/read-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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

  @Put('avatar')
  @HttpCode(204)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: {
        // TODO: put this config somewhere else
        fileSize: 5 * 1024 * 1024, // 5 MB max file size
      },
      fileFilter: (req, file, cb) => {
        // TODO: put this valiation somewhere else
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  updateAvatar(
    @GetUser() user: AuthenticatedUser,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(user.userId, photo);
  }
}
