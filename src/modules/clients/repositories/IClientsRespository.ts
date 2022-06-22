import { ICreateClientDTO } from "../useCases/createClientUseCase/ICreateClientDTO";

export interface IClientsRespository {
  create(data: ICreateClientDTO): Promise<void>;
}