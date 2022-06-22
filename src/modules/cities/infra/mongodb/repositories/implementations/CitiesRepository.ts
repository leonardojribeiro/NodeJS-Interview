import { FilterQuery, isValidObjectId, Model } from "mongoose";
import { injectable } from "tsyringe";
import { ICity } from "../../../../entities/ICity";
import { ICitiesRepository } from "../../../../repositories/ICitiesRepository";
import { ICreateCityDTO } from "../../../../useCases/createCity/CreateCityDTO";
import { IFindCitiesDTO } from "../../../../useCases/findCities/IFindCitiesDTO";
import { CityModel } from "../../models/CityModel";

@injectable()
export class CitiesRepository implements ICitiesRepository {
  private readonly cityModel: Model<ICity>;

  constructor() {
    this.cityModel = CityModel;
  }

  validateId(id: string): boolean {
    return isValidObjectId(id);
  }

  async findById(id: string): Promise<ICity | null> {
    return this.cityModel
      .findById(id)
      .select("name state");
  }

  async find({ name, state }: IFindCitiesDTO): Promise<ICity[]> {
    const query: FilterQuery<ICity> = {};
    if (name) {
      query.name = {
        $regex: name,
        $options: 'i',
      };
    }
    if (state) {
      query.state = {
        $regex: state,
        $options: 'i',
      }
    }
    return await this.cityModel
      .find(query)
      .select("name state");
  }

  async countByNameAndState(name: string, state: string): Promise<number> {
    return await this.cityModel.countDocuments({
      name: {
        $regex: name,
        $options: 'i',
      },
      state: {
        $regex: state,
        $options: 'i',
      }
    });
  }

  async create(data: ICreateCityDTO): Promise<void> {
    await this.cityModel.create(data);
  }

}