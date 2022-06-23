import { AppError } from "../../../../shared/errors/AppError";

export namespace DeleteClientByIdError {
  export class NotFound extends AppError {
    constructor() {
      super('Client not found.', 404);
    }
  }
  export class InvalidId extends AppError {
    constructor() {
      super('The id must be a valid id.');
    }
  }
}