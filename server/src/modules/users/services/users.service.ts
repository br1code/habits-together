import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ReadUserDto } from '../dtos/read-user.dto';
import { EXPERIENCE_POINTS_MULTIPLIER } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  private toReadUserDto(user: User): ReadUserDto {
    return {
      id: user.id,
      username: user.username,
      profilePictureUrl: user.profile_picture_url,
      level: user.level,
      currentExperiencePoints: user.experience_points,
      maxExperiencePoints: this.calculateMaxExperiencePoints(user.level),
    };
  }

  // TODO: move somewhere else
  private calculateMaxExperiencePoints(level: number): number {
    return level * EXPERIENCE_POINTS_MULTIPLIER;
  }
}
