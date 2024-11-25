export class CloudinaryError extends Error {
  constructor(
    message: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'CloudinaryError';
  }
}
