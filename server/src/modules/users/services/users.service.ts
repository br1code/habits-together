import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ReadUserDto } from '../dtos/read-user.dto';
import {
  ActivityType,
  ActivityXpMap,
  ExperienceLog,
} from '../entities/experience-log.entity';
import {
  EXPERIENCE_POINTS_BASE,
  EXPERIENCE_POINTS_MULTIPLIER,
} from '../constants';
import {
  FILE_STORAGE_PROVIDER,
  FileStorageProvider,
} from 'src/modules/file-storage/interfaces/file-storage.interface';
import { ReadExperienceLogQueryDto } from '../dtos/read-experience-log-query.dto';
import { ReadExperienceLogDto } from '../dtos/read-experience-log.dto';
import { formatDateForDisplay } from 'src/utils/dateUtils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ExperienceLog)
    private experienceLogsRepository: Repository<ExperienceLog>,
    @Inject(FILE_STORAGE_PROVIDER)
    private readonly fileStorageProvider: FileStorageProvider,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(
        `User with username ${username} was not found.`,
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} was not found.`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async getUserProfile(userId: string): Promise<ReadUserDto> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    return this.toReadUserDto(user);
  }

  // TODO: update after implementing UserFriendship entity
  async getFriendsProfiles(userId: string): Promise<ReadUserDto[]> {
    const friends = await this.usersRepository.find({
      where: {
        id: Not(userId),
      },
    });

    return friends.map((user) => this.toReadUserDto(user));
  }

  // TODO: update after implementing UserFriendship entity
  async getFriendProfile(
    userId: string,
    friendId: string,
  ): Promise<ReadUserDto> {
    if (userId === friendId) {
      throw new NotFoundException('User not found');
    }

    const friend = await this.usersRepository.findOneBy({ id: friendId });

    if (!friend) {
      throw new NotFoundException(`User not found.`);
    }

    return this.toReadUserDto(friend);
  }

  // TODO: review this logic, currently users can obtain infinite XP by multiple ways:
  // validating and invalidating a log, creating and deleting habits, etc
  async addExperience(
    userId: string,
    activityType: ActivityType,
    relatedId?: string,
  ) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Calculate XP gained
    const xpGained = ActivityXpMap[activityType];
    user.experience_points += xpGained;

    // Calculate the new level and XP using the exponential formula
    const { currentXp, leveledUp } = this.calculateExponentialLevel(
      user.experience_points,
      user.level,
    );

    // Handle leveling up
    if (leveledUp) {
      user.level++; // Increment the level
      user.experience_points = currentXp; // Retain overflow XP (XP beyond the required XP for the current level)
    }

    await this.usersRepository.save(user);

    const experienceLog = this.experienceLogsRepository.create({
      user: { id: userId },
      activityType: activityType,
      relatedId: relatedId,
      xpGained: xpGained,
    });

    await this.experienceLogsRepository.save(experienceLog);
  }

  async updateAvatar(userId: string, photo: Express.Multer.File) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    if (user.profile_picture_url) {
      await this.fileStorageProvider.delete(user.profile_picture_url);
    }

    const { url: photoUrl } = await this.fileStorageProvider.upload(photo);

    this.usersRepository.update(userId, {
      profile_picture_url: photoUrl,
    });
  }

  private calculateExponentialLevel(
    totalXp: number,
    currentLevel: number,
  ): {
    currentXp: number;
    requiredXp: number;
    leveledUp: boolean;
  } {
    const baseXP = EXPERIENCE_POINTS_BASE; // Base XP required for level 1
    const multiplier = EXPERIENCE_POINTS_MULTIPLIER; // Growth factor for XP

    let leveledUp = false;
    let requiredXp = baseXP * Math.pow(multiplier, currentLevel - 1); // XP required for the current level

    // Check if the user has leveled up by subtracting the required XP
    while (totalXp >= requiredXp) {
      totalXp -= requiredXp;
      currentLevel++;
      requiredXp = baseXP * Math.pow(multiplier, currentLevel - 1); // Update required XP for the next level
      leveledUp = true;
    }

    return {
      currentXp: Math.round(totalXp),
      requiredXp: Math.round(requiredXp),
      leveledUp,
    };
  }

  async getExperienceLogs(
    userId: string,
    query: ReadExperienceLogQueryDto,
  ): Promise<ReadExperienceLogDto[]> {
    const queryBuilder = this.experienceLogsRepository
      .createQueryBuilder('experienceLog')
      .where('experienceLog.userId = :userId', { userId })
      .orderBy('experienceLog.createdAt', 'DESC');

    const experienceLogs = await queryBuilder
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return experienceLogs.map((xpLog) => ({
      id: xpLog.id,
      relatedId: xpLog.relatedId,
      xpGained: xpLog.xpGained,
      activityType: xpLog.activityType,
      createdAt: formatDateForDisplay(xpLog.createdAt),
    }));
  }

  private toReadUserDto(user: User): ReadUserDto {
    const { currentXp, requiredXp } = this.calculateExponentialLevel(
      user.experience_points,
      user.level,
    );

    return {
      id: user.id,
      username: user.username,
      profilePictureUrl: user.profile_picture_url,
      level: user.level,
      currentExperiencePoints: currentXp,
      requiredExperiencePoints: requiredXp,
    };
  }
}
