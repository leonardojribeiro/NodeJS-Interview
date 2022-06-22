import { isValidObjectId, Types } from "mongoose";
import { ICity } from "../../entities/ICity";
import { ICreateCityDTO } from "../../useCases/createCity/CreateCityDTO";
import { IFindCitiesDTO } from "../../useCases/findCities/IFindCitiesDTO";
import { ICitiesRepository } from "../ICitiesRepository";

export class InMemoryCitiesRepository implements ICitiesRepository {
  private cities: ICity[] = [];

  async find({ name, state }: IFindCitiesDTO): Promise<ICity[]> {
    let matches = this.cities;

    if (name) {
      matches = matches.filter(city => city.name.toLowerCase().startsWith(name.toLowerCase()));
    }
    if (state) {
      matches = matches.filter(city => city.state.toLowerCase().startsWith(state.toLowerCase()));
    }
    return matches;
  }

  async countByNameAndState(name: string, state: string): Promise<number> {
    const matches = this.cities.filter(city => city.name.toLowerCase() === name.toLowerCase() && city.state.toLowerCase() === state.toLowerCase());
    return matches.length;
  }

  validateId(id: string): boolean {
    return isValidObjectId(id);
  }

  async findById(id: string): Promise<ICity | null> {
    return this.cities.find(city => city.id === id) as ICity | null;
  }

  async create({ name, state }: ICreateCityDTO): Promise<void> {
    const city: ICity = {
      id: new Types.ObjectId().toString(),
      name,
      state,
    };

    this.cities.push(city);
  }

}
