import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  HABIT_LOG_CREATION = 'habit_log_creation',
  HABIT_LOG_VALIDATION = 'habit_log_validation',
  STREAK_MILESTONE = 'streak_milestone',
}

@Entity()
export class ExperienceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({ type: 'uuid', nullable: true })
  relatedId?: string;

  @Column({ type: 'integer' })
  xpGained: number;

  @CreateDateColumn()
  createdAt: Date;
}
