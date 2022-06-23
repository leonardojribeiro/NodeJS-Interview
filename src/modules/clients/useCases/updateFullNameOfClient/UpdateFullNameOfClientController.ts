import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateFullNameOfClientUseCase } from "./UpdateFullNameOfClientUseCase";

export class UpdateFullnameOfClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { fullName } = request.body;
    const updateFullNameOfClientUseCase = container.resolve(UpdateFullNameOfClientUseCase);
    await updateFullNameOfClientUseCase.execute({
      id,
      fullName,
    });
    return response.status(200).send();
  }
}