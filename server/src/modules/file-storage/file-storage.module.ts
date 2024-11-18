import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './services/cloudinary.service';
import { FILE_STORAGE_PROVIDER } from './interfaces/file-storage.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FILE_STORAGE_PROVIDER,
      useClass: CloudinaryService,
    },
  ],
  exports: [FILE_STORAGE_PROVIDER],
})
export class FileStorageModule {}
