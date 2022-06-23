import { inject, injectable } from "tsyringe";
import { IClientWithCity } from "../../entities/IClient";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { FindClientByIdError } from "./FindClientByIdError";

@injectable()
export class FindClientByIdUseCase {
  constructor(
    @inject('ClientsRepository')
    private readonly clientsRepository: IClientsRespository,
  ) { }

  async execute(id: string): Promise<IClientWithCity> {
    const isValidId = this.clientsRepository.validateId(id);
    if (!isValidId) {
      throw new FindClientByIdError.InvalidId();
    }
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new FindClientByIdError.NotFound();
    }
    return client;
  }
} 