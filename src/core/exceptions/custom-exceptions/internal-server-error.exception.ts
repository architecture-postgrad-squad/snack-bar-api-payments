export class InternalServerErrorException extends Error {
  private details?: string;

  constructor(
    message?: { description: string; details?: string },
    private statusCode = 500,
  ) {
    super(message.description);
    this.details = message.details;
    this.statusCode = statusCode;
    this.name = 'InternalServerErrorException';
  }

  public getMessage(): string {
    return this.message;
  }

  public getDetails(): string | undefined {
    return this.details;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}
