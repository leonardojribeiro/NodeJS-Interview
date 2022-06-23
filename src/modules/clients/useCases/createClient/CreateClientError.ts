import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateClientError {
  export class EmptyFullName extends AppError {
    constructor() {
      super('The "fullName" can not be empty.');
    }
  }
  export class ClientAlreadyExists extends AppError {
    constructor() {
      super('Client alread exists.');
    }
  }
  export class EmptyBirthdate extends AppError {
    constructor() {
      super('The "birthdate" can not be empty.');
    }
  }
  export class EmptyCityId extends AppError {
    constructor() {
      super('The "city_id" can not be empty.');
    }
  }
  export class InvalidCityId extends AppError {
    constructor() {
      super('The "city_id" must be a valid id.',);
    }
  }
  export class CityNotFound extends AppError {
    constructor() {
      super('City not found.', 404);
    }
  }
  export class EmptyAge extends AppError {
    constructor() {
      super('The "age" can not be empty.');
    }
  }
  export class EmptyGender extends AppError {
    constructor() {
      super('The "gender" can not be empty.');
    }
  }
}