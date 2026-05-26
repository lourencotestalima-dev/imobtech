export class AppError {
  public errorCode: number;
  public message: string;

  constructor(errorCode: number, message: string) {
    this.message = message;
    this.errorCode = errorCode;
  }
}