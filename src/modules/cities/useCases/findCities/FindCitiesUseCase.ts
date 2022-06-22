import { inject, injectable } from "tsyringe";
import { ICity } from "../../entities/ICity";
import { ICitiesRepository } from "../../repositories/ICitiesRepository";
import { IFindCitiesDTO } from "./IFindCitiesDTO";

@injectable()
export class FindCitiesUseCase {

  constructor(
    @inject('CitiesRepository')
    private readonly citiesRepository: ICitiesRepository,
  ) { }

  async execute(data: IFindCitiesDTO): Promise<ICity[]> {
    return this.citiesRepository.find(data);
  }
}