import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HabitLog } from './habit-log.entity';

@Entity()
export class HabitLogComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HabitLog, (habitLog) => habitLog.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  habitLog: HabitLog;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
