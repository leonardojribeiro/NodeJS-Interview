import { inject, injectable } from "tsyringe";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { IUpdateFullNameOfClientDTO } from "./IUpdateFullNameOfClientDTO";
import { UpdateFullNameOfClientError } from "./UpdateFullNameOfClientError";

@injectable()
export class UpdateFullNameOfClientUseCase {
  constructor(
    @inject('ClientsRepository')
    private readonly clientsRepository: IClientsRespository,
  ) { }

  async execute({ fullName, id }: IUpdateFullNameOfClientDTO): Promise<void> {
    const isValidId = this.clientsRepository.validateId(id);
    if (!fullName) {
      throw new UpdateFullNameOfClientError.EmptyFullName();
    }
    if (!isValidId) {
      throw new UpdateFullNameOfClientError.InvalidId();
    }
    const currentClient = await this.clientsRepository.findById(id); 
    if (!currentClient) {
      throw new UpdateFullNameOfClientError.NotFound();
    }
    const anotherClientWithSameFullname = await this.clientsRepository.countByFullNameAndDifferentId(fullName, id);
    if (anotherClientWithSameFullname) {
      throw new UpdateFullNameOfClientError.ClientAlreadyExists();
    }
    await this.clientsRepository.updateFullName({
      fullName,
      id
    });
  }
}