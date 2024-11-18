export const FILE_STORAGE_PROVIDER = Symbol('FILE_STORAGE_PROVIDER');

export interface FileStorageProvider {
  upload(file: Express.Multer.File): Promise<{ url: string; publicId: string }>;
}
