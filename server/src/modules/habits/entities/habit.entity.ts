import { HabitLog } from 'src/modules/habit-logs/entities/habit-log.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  rules: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.habits, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => HabitLog, (habitLog) => habitLog.habit, { cascade: true })
  logs: HabitLog[];
}
