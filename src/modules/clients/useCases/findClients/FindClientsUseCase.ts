import { inject, injectable } from "tsyringe";
import { IClientWithCity } from "../../entities/IClient";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { IFindClientsDTO } from "./IFindClientsDTO";

@injectable()
export class FindClientsUseCase {
  constructor(
    @inject('ClientsRepository')
    private readonly clientsRepository: IClientsRespository,
  ) { }

  async execute(data: IFindClientsDTO): Promise<IClientWithCity[]> {
    return this.clientsRepository.find(data);
  }
} 