import { VacationRequestDto } from '../dto/vacation-request.dto';

export abstract class ValidationHandler {
  private nextHandler: ValidationHandler;

  public setNext(handler: ValidationHandler): ValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  public async handle(
    request: VacationRequestDto,
    id: string,
    errors: Array<string>,
  ): Promise<boolean> {
    if (this.nextHandler) {
      return this.nextHandler.handle(request, id, errors);
    }

    if (errors.length != 0) {
      return false;
    }

    return true;
  }
}
