import { AppError } from "../../../../shared/errors/AppError";

export namespace FindClientByIdError {
  export class InvalidId extends AppError {
    constructor() {
      super('The id must be a valid id.');
    }
  }
  export class NotFound extends AppError {
    constructor() {
      super('Client not found.', 404);
    }
  }
}