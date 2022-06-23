import { IClientWithCity } from "../entities/IClient";
import { ICreateClientDTO } from "../useCases/createClient/ICreateClientDTO";
import { IFindClientsDTO } from "../useCases/findClients/IFindClientsDTO";
import { IUpdateFullNameOfClientDTO } from "../useCases/updateFullNameOfClient/IUpdateFullNameOfClientDTO";

export interface IClientsRespository {
  deleteById(id: string): Promise<void>;
  updateFullName(data: IUpdateFullNameOfClientDTO): Promise<void>;
  countByFullNameAndDifferentId(fullname: string, id: string): Promise<number>;
  findById(id: string): Promise<IClientWithCity | null>;
  create(data: ICreateClientDTO): Promise<void>;
  countByFullName(fullName: string): Promise<number>;
  validateId(id: string): boolean;
  find(data: IFindClientsDTO): Promise<IClientWithCity[]>;
}