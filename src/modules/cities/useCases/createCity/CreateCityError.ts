import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateCityError {
  export class EmptyName extends AppError {
    constructor() {
      super('The "name" can not be empty.');
    }
  }
  export class EmptyState extends AppError {
    constructor() {
      super('The "state" can not be empty.');
    }
  }
  export class CityAlreadyExists extends AppError {
    constructor() {
      super('City already exists.');
    }
  }
}