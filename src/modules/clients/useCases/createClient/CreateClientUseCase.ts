import { inject, injectable } from "tsyringe";
import { ICitiesRepository } from "../../../cities/repositories/ICitiesRepository";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { CreateClientError } from "./CreateClientError";
import { ICreateClientDTO } from "./ICreateClientDTO";

@injectable()
export class CreateClientUseCase {
  constructor(
    @inject('ClientsRepository')
    private readonly clientsRepository: IClientsRespository,
    @inject('CitiesRepository')
    private readonly citiesRepository: ICitiesRepository,
  ) { }

  async execute({ fullName, age, birthdate, city_id, gender }: ICreateClientDTO): Promise<void> {
    if (!fullName) {
      throw new CreateClientError.EmptyFullName();
    }
    if (isNaN(age)) {
      throw new CreateClientError.EmptyAge();
    }
    if (!birthdate) {
      throw new CreateClientError.EmptyBirthdate();
    }
    if (!gender) {
      throw new CreateClientError.EmptyGender();
    }
    if (!city_id) {
      throw new CreateClientError.EmptyCityId();
    }
    const cityIdIsValid = this.citiesRepository.validateId(city_id);
    if (!cityIdIsValid) {
      throw new CreateClientError.InvalidCityId();
    }
    const cityExists = await this.citiesRepository.findById(city_id);
    if (!cityExists) {
      throw new CreateClientError.CityNotFound();
    }
    const clientAlreadyExists = await this.clientsRepository.countByFullName(fullName);
    if (clientAlreadyExists) {
      throw new CreateClientError.ClientAlreadyExists();
    }
    await this.clientsRepository.create({
      fullName,
      age,
      birthdate,
      city_id,
      gender,
    });
  }
}