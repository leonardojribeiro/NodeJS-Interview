import { inject, injectable } from "tsyringe";
import { ICity } from "../../entities/ICity";
import { ICitiesRepository } from "../../repositories/ICitiesRepository";
import { FindCityByIdError } from "./FindCityByIdError";

@injectable()
export class FindCityByIdUseCase {

  constructor(
    @inject('CitiesRepository')
    private readonly citiesRepository: ICitiesRepository,
  ) { }

  async execute(id: string): Promise<ICity> {
    const isValidId = this.citiesRepository.validateId(id);
    if (!isValidId) {
      throw new FindCityByIdError.InvalidId();
    }
    const city = await this.citiesRepository.findById(id);

    if (!city) {
      throw new FindCityByIdError.NotFound();
    }
    return city;
  }
}