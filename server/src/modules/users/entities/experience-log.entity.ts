import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  HABIT_CREATION = 'habit_creation',
  HABIT_LOG_CREATION = 'habit_log_creation',
  HABIT_LOG_VALIDATION_PERFORMED = 'habit_log_validation_performed',
  HABIT_LOG_VALIDATION_RECEIVED = 'habit_log_validation_received',
}

export const ActivityXpMap: Record<ActivityType, number> = {
  [ActivityType.HABIT_CREATION]: 50,
  [ActivityType.HABIT_LOG_CREATION]: 20,
  [ActivityType.HABIT_LOG_VALIDATION_PERFORMED]: 10,
  [ActivityType.HABIT_LOG_VALIDATION_RECEIVED]: 10,
};

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
