import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './services/seed/seed.service';
import { HabitsModule } from './modules/habits/habits.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { HabitLogsModule } from './modules/habit-logs/habit-logs.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { ARGENTINA_TIMEZONE } from './constants';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true',
        autoLoadEntities: true,
        ssl: {
          ca: fs
            .readFileSync(configService.get('DATABASE_CERT_PATH'))
            .toString(),
        },

        extra: {
          options: `-c timezone=${ARGENTINA_TIMEZONE}`,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HabitsModule,
    AuthModule,
    HabitLogsModule,
    FileStorageModule,
  ],
  controllers: [],
  providers: [
    SeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly seedService: SeedService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get('SEED_DATABASE');

    if (shouldSeed === 'true') {
      await this.seedService.seedDatabase();
    }
  }
}
