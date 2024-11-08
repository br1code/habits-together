import { Habit } from 'src/modules/habits/entities/habit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Store hashed password

  @Column({ nullable: true })
  profile_picture_url?: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience_points: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];
}
