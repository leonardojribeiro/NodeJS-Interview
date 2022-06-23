import { inject, injectable } from "tsyringe";
import { ICitiesRepository } from "../../repositories/ICitiesRepository";
import { ICreateCityDTO } from "./CreateCityDTO";
import { CreateCityError } from "./CreateCityError";


@injectable()
export class CreateCityUseCase {
  constructor(
    @inject('CitiesRepository')
    private readonly citiesRepository: ICitiesRepository,
  ) { }

  async execute({ name, state }: ICreateCityDTO): Promise<void> {
    if (!name) {
      throw new CreateCityError.EmptyName();
    }
    if (!state) {
      throw new CreateCityError.EmptyState();
    }
    const cityAlreadyExists = await this.citiesRepository.countByNameAndState(name, state);
    if (cityAlreadyExists) {
      throw new CreateCityError.CityAlreadyExists();
    }
    await this.citiesRepository.create({
      name,
      state
    });
  }
}