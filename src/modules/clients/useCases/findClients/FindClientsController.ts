import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindClientsUseCase } from "./FindClientsUseCase";

export class FindClientsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const fullName = request.query.fullName as string | undefined;
    const findClientsUseCase = container.resolve(FindClientsUseCase);
    const clients = await findClientsUseCase.execute({
      fullName,
    });
    return response.json(clients);
  }
}