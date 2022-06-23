import { container } from "tsyringe";
import { CitiesRepository } from "../../modules/cities/infra/mongodb/repositories/implementations/CitiesRepository";
import { ICitiesRepository } from "../../modules/cities/repositories/ICitiesRepository";
import { CreateCityUseCase } from "../../modules/cities/useCases/createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../../modules/cities/useCases/findCities/FindCitiesUseCase";
import { FindCityByIdUseCase } from "../../modules/cities/useCases/findCityById/FindCityByIdUseCase";
import { ClientsRepository } from "../../modules/clients/infra/mongodb/repositories/implementations/ClientsRepository";
import { IClientsRespository } from "../../modules/clients/repositories/IClientsRespository";
import { CreateClientUseCase } from "../../modules/clients/useCases/createClient/CreateClientUseCase";
import { DeleteClientByIdUseCase } from "../../modules/clients/useCases/deleteClientById/DeleteClientByIdUseCase";
import { FindClientByIdUseCase } from "../../modules/clients/useCases/findClientById/FindClientByIdUseCase";
import { FindClientsUseCase } from "../../modules/clients/useCases/findClients/FindClientsUseCase";
import { UpdateFullNameOfClientUseCase } from "../../modules/clients/useCases/updateFullNameOfClient/UpdateFullNameOfClientUseCase";

export function setupDependencies() {
  // cities
  container.registerSingleton<ICitiesRepository>('CitiesRepository', CitiesRepository);
  container.registerSingleton<CreateCityUseCase>('CreateCityUseCase', CreateCityUseCase);
  container.registerSingleton<FindCitiesUseCase>('FindCitiesUseCase', FindCitiesUseCase);
  container.registerSingleton<FindCityByIdUseCase>('FindCityByIdUseCase', FindCityByIdUseCase);
  // clients
  container.registerSingleton<IClientsRespository>('ClientsRepository', ClientsRepository);
  container.registerSingleton<CreateClientUseCase>('CreateClientUseCase', CreateClientUseCase);
  container.registerSingleton<FindClientsUseCase>('FindClientsUseCase', FindClientsUseCase);
  container.registerSingleton<FindClientByIdUseCase>('FindClientByIdUseCase', FindClientByIdUseCase);
  container.registerSingleton<UpdateFullNameOfClientUseCase>('UpdateFullNameOfClientUseCase', UpdateFullNameOfClientUseCase);
  container.registerSingleton<DeleteClientByIdUseCase>('DeleteClientByIdUseCase', DeleteClientByIdUseCase);
}