import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCitiesUseCase } from "./FindCitiesUseCase";

export class FindCitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const name = request.query.name as string | undefined;
    const state = request.query.state as string | undefined;

    const findCitiesUseCase = container.resolve(FindCitiesUseCase);
    const cities = await findCitiesUseCase.execute({
      name,
      state
    });
    return response.json(cities);
  }
}