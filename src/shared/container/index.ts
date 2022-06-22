import { container } from "tsyringe";
import { CitiesRepository } from "../../modules/cities/infra/mongodb/repositories/implementations/CitiesRepository";
import { ICitiesRepository } from "../../modules/cities/repositories/ICitiesRepository";
import { CreateCityUseCase } from "../../modules/cities/useCases/createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../../modules/cities/useCases/findCities/FindCitiesUseCase";

export function setupDependencies() {
  container.registerSingleton<ICitiesRepository>('CitiesRepository', CitiesRepository);
  container.registerSingleton<CreateCityUseCase>('CreateCityUseCase', CreateCityUseCase);
  container.registerSingleton<FindCitiesUseCase>('FindCitiesUseCase', FindCitiesUseCase);
}