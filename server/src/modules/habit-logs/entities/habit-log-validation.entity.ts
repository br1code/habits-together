import { User } from 'src/modules/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { HabitLog } from './habit-log.entity';

@Entity()
@Unique(['habitLog', 'validatorUser'])
export class HabitLogValidation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HabitLog, (habitLog) => habitLog.validations, {
    nullable: false,
  })
  @JoinColumn({ name: 'habit_log_id' })
  habitLog: HabitLog;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'validator_user_id' })
  validatorUser: User;

  @CreateDateColumn({ name: 'validated_at' })
  validatedAt: Date;
}
