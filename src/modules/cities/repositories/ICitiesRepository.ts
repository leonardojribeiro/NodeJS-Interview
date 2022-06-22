import { ICity } from "../entities/ICity";
import { ICreateCityDTO } from "../useCases/createCity/CreateCityDTO";
import { IFindCitiesDTO } from "../useCases/findCities/IFindCitiesDTO";

export interface ICitiesRepository {
  find(data: IFindCitiesDTO): Promise<ICity[]>;
  create(data: ICreateCityDTO): Promise<void>;
  countByNameAndState(name: string, state: string): Promise<number>;
  validateId(id: string): boolean;
  findById(id: string): Promise<ICity | null>;
}