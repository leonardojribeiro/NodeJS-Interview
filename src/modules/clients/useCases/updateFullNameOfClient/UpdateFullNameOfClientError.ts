import { AppError } from "../../../../shared/errors/AppError";

export namespace UpdateFullNameOfClientError {
  export class EmptyFullName extends AppError {
    constructor() {
      super('The "fullname" can not be empty.');
    }
  }
  export class ClientWithSameFullNameAlreadyExists extends AppError {
    constructor() {
      super('Client alread exists.');
    }
  }
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