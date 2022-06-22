import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCityByIdUseCase } from "./FindCityByIdUseCase";

export class FindCityByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findCitiesUseCase = container.resolve(FindCityByIdUseCase);
    const city = await findCitiesUseCase.execute(id);
    return response.json(city);
  }
}