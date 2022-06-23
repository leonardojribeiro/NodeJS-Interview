import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteClientByIdUseCase } from "./DeleteClientByIdUseCase";

export class DeleteClientByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteClientByIdUseCase = container.resolve(DeleteClientByIdUseCase);
    await deleteClientByIdUseCase.execute(id);
    return response.status(204).send();
  }
}