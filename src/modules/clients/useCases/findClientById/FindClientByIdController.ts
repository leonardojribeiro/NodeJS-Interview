import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindClientByIdUseCase } from "./FindClientByIdUseCase";

export class FindClientByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findClientByIdUseCase = container.resolve(FindClientByIdUseCase);
    const client = await findClientByIdUseCase.execute(id);
    return response.json(client);
  }
}