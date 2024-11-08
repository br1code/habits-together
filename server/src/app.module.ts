import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './services/seed/seed.service';
import { HabitsModule } from './modules/habits/habits.module';

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
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HabitsModule,
  ],
  controllers: [],
  providers: [SeedService],
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
