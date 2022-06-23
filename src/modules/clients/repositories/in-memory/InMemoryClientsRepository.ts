import { isValidObjectId, Types } from "mongoose";
import { ICitiesRepository } from "../../../cities/repositories/ICitiesRepository";
import { IClient, IClientWithCity } from "../../entities/IClient";
import { ICreateClientDTO } from "../../useCases/createClient/ICreateClientDTO";
import { IFindClientsDTO } from "../../useCases/findClients/IFindClientsDTO";
import { IUpdateFullNameOfClientDTO } from "../../useCases/updateFullNameOfClient/IUpdateFullNameOfClientDTO";
import { IClientsRespository } from "../IClientsRespository";

export class InMemoryClientsRepository implements IClientsRespository {
  private clients: IClient[] = [];

  constructor(
    private readonly citiesRepository: ICitiesRepository
  ) { }

  async deleteById(id: string): Promise<void> {
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.clients.splice(index, 1);
  }

  async updateFullName({ fullName, id }: IUpdateFullNameOfClientDTO): Promise<void> {
    const index = this.clients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.clients[index].fullName = fullName;
  }

  async countByFullNameAndDifferentId(fullName: string, id: string): Promise<number> {
    const matches = this.clients.filter(client => client.fullName.toLowerCase() === fullName.toLowerCase() && client.id !== id);
    return matches.length;
  }

  async findById(id: string): Promise<IClientWithCity | null> {
    const client = this.clients.find(client => client.id === id);
    if (client) {
      const city = await this.citiesRepository.findById(client.city);
      if (!city) {
        throw new Error("City not found.");
      }
      return {
        ...client,
        city: city
      }
    }
    return null;
  }

  async create({ fullName, age, birthdate, city_id, gender }: ICreateClientDTO): Promise<void> {
    const client: IClient = {
      id: new Types.ObjectId().toString(),
      fullName,
      age,
      birthdate,
      city: city_id,
      gender,
    };
    this.clients.push(client);
  }

  async countByFullName(fullName: string): Promise<number> {
    const matches = this.clients.filter(client => client.fullName.toLowerCase() === fullName.toLowerCase());
    return matches.length;
  }

  validateId(id: string): boolean {
    return isValidObjectId(id);
  }

  async find({ fullName }: IFindClientsDTO): Promise<IClientWithCity[]> {
    let matches = this.clients;
    if (fullName) {
      matches = matches.filter(client => client.fullName.toLowerCase().startsWith(fullName.toLowerCase()));
    }
    const clientsWithCityPromise = matches.map(async client => {
      const city = await this.citiesRepository.findById(client.city);
      if (!city) {
        throw new Error("City not found.");
      }
      return {
        ...client,
        city: city
      }
    });
    const clientsWithCity = await Promise.all(clientsWithCityPromise);
    return clientsWithCity;
  }
}
