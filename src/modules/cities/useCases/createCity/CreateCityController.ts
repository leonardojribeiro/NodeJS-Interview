import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCityUseCase } from "./CreateCityUseCase";

export class CreateCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, state } = request.body;
    const createCityUseCase = container.resolve(CreateCityUseCase);
    await createCityUseCase.execute({
      name,
      state
    });
    return response.status(201).send();
  }
}