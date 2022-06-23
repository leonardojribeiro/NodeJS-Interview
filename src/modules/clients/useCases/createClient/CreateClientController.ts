import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateClientUseCase } from "./CreateClientUseCase";

export class CreateClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { fullName, age, birthdate, city_id, gender } = request.body;
    const createClientUseCase = container.resolve(CreateClientUseCase);
    await createClientUseCase.execute({
      fullName,
      age,
      birthdate,
      city_id,
      gender
    });
    return response.status(201).send();
  }
}