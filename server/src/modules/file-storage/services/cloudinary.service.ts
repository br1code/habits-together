import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileStorageProvider } from '../interfaces/file-storage.interface';
import { CloudinaryError } from '../exceptions/cloudinary.error';

const UPLOADS_FOLDER_NAME = 'uploads';
const RESOURCE_TYPE = 'image';

@Injectable()
export class CloudinaryService implements FileStorageProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      try {
        cloudinary.uploader
          .upload_stream(
            {
              folder: UPLOADS_FOLDER_NAME,
              resource_type: RESOURCE_TYPE,
            },
            (error, result: UploadApiResponse) => {
              if (error) {
                return reject(
                  new CloudinaryError(
                    'Failed to upload file to Cloudinary',
                    error,
                  ),
                );
              }
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            },
          )
          .end(file.buffer);
      } catch (error) {
        throw new CloudinaryError('Unexpected error during file upload', error);
      }
    });
  }

  async delete(url: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(url);
      console.log(publicId);
      await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            return reject(
              new CloudinaryError(
                `Failed to delete file from Cloudinary`,
                error,
              ),
            );
          }
          if (result.result !== 'ok') {
            return reject(
              new CloudinaryError(
                `Cloudinary deletion failed: ${result.result}`,
                result,
              ),
            );
          }
          resolve();
        });
      });
    } catch (error) {
      throw new CloudinaryError('Unexpected error during file deletion', error);
    }
  }

  private extractPublicId(url: string): string {
    const regex = new RegExp(
      `/${UPLOADS_FOLDER_NAME}/(?:v\\d+/)?(.+)\\.[a-z]+$`,
      'i', // Case-insensitive match
    );
    const match = url.match(regex);
    if (!match || match.length < 2) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
    return `${UPLOADS_FOLDER_NAME}/${match[1]}`;
  }
}
