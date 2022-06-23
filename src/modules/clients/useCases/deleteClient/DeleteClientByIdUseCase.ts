import { inject, injectable } from "tsyringe";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { DeleteClientByIdError } from "./DeleteClientByIdError";

@injectable()
export class DeleteClientByIdUseCase {
  constructor(
    @inject('ClientsRepository')
    private readonly clientsRepository: IClientsRespository,
  ) { }

  async execute(id: string): Promise<void> {
    const isValidId = this.clientsRepository.validateId(id);
    if (!isValidId) {
      throw new DeleteClientByIdError.InvalidId();
    }
    const currentClient = await this.clientsRepository.findById(id);
    if (!currentClient) {
      throw new DeleteClientByIdError.NotFound();
    }
    await this.clientsRepository.deleteById(id);
  }
}