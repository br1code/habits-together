import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HabitLogsService } from '../services/habit-logs.service';
import { CreateHabitLogDto } from '../dtos/create-habit-log.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { ReadHabitLogDto } from '../dtos/read-habit-log.dto';
import { ReadHabitLogsQueryDto } from '../dtos/read-habit-logs-query.dto';
import { ReadHabitLogSummaryDto } from '../dtos/read-habit-log-summary.dto';
import { CreateHabitLogCommentDto } from '../dtos/create-habit-log-comment.dto';

@Controller('logs')
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Get()
  getHabitLogs(
    @Query() query: ReadHabitLogsQueryDto,
  ): Promise<ReadHabitLogSummaryDto[]> {
    return this.habitLogsService.getHabitLogs(query);
  }

  @Get(':id')
  getHabitLog(
    @Param('id', new ParseUUIDPipe()) habitLogId: string,
  ): Promise<ReadHabitLogDto> {
    return this.habitLogsService.getHabitLog(habitLogId);
  }

  @Post()
  @HttpCode(201)
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
  createHabitLog(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateHabitLogDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<string> {
    return this.habitLogsService.createHabitLog(user.userId, dto, photo);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteHabitLog(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitLogId: string,
  ) {
    return this.habitLogsService.deleteHabitLog(user.userId, habitLogId);
  }

  @Post(':id/validate')
  @HttpCode(204)
  validateHabitLog(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitLogId: string,
  ) {
    return this.habitLogsService.validateHabitLog(user.userId, habitLogId);
  }

  // TODO: stop returning plain values like strings, always return a JSON content or no content at all
  @Post(':id/comments')
  @HttpCode(204)
  addComment(
    @GetUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) habitLogId: string,
    @Body() dto: CreateHabitLogCommentDto,
  ): Promise<string> {
    return this.habitLogsService.addComment(user.userId, habitLogId, dto);
  }

  @Delete(':logId/comments/:commentId')
  @HttpCode(204)
  deleteComment(
    @GetUser() user: AuthenticatedUser,
    @Param('logId', new ParseUUIDPipe()) habitLogId: string,
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
  ) {
    return this.habitLogsService.removeComment(
      user.userId,
      habitLogId,
      commentId,
    );
  }
}
