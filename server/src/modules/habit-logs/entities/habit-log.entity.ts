import { Habit } from 'src/modules/habits/entities/habit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { HabitLogValidation } from './habit-log-validation.entity';
import { HabitLogComment } from './habit-log-comment.entity';

@Entity()
@Unique(['habit', 'date'])
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  text_entry?: string;

  @Column({ type: 'text' })
  photo_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Habit, (habit) => habit.logs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  habit: Habit;

  @OneToMany(() => HabitLogValidation, (validation) => validation.habitLog, {
    cascade: true,
  })
  validations: HabitLogValidation[];

  @OneToMany(() => HabitLogComment, (comment) => comment.habitLog, {
    cascade: true,
  })
  comments: HabitLogComment[];
}
