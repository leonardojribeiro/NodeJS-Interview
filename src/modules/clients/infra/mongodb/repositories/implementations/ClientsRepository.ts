import { FilterQuery, isValidObjectId, Model } from "mongoose";
import { injectable } from "tsyringe";
import { ICity } from "../../../../../cities/entities/ICity";
import { IClient, IClientWithCity } from "../../../../entities/IClient";
import { IClientsRespository } from "../../../../repositories/IClientsRespository";
import { ICreateClientDTO } from "../../../../useCases/createClient/ICreateClientDTO";
import { IFindClientsDTO } from "../../../../useCases/findClients/IFindClientsDTO";
import { IUpdateFullNameOfClientDTO } from "../../../../useCases/updateFullNameOfClient/IUpdateFullNameOfClientDTO";
import { ClientModel } from "../../models/ClientModel";

@injectable()
export class ClientsRepository implements IClientsRespository {
  private readonly clientModel: Model<IClient>;

  constructor() {
    this.clientModel = ClientModel;
  }

  async deleteById(id: string): Promise<void> {
    await this.clientModel.deleteOne({
      _id: id,
    });
  }

  async updateFullName({ id, fullName }: IUpdateFullNameOfClientDTO): Promise<void> {
    await this.clientModel.updateOne({
      _id: id
    },
      {
        $set: {
          fullName: fullName,
        }
      }
    );
  }


  async countByFullNameAndDifferentId(fullName: string, id: string): Promise<number> {
    return await this.clientModel.countDocuments({
      _id: {
        $ne: id,
      },
      fullName: {
        $regex: fullName,
        $options: "i",
      }
    });
  }

  async findById(id: string): Promise<IClientWithCity | null> {
    return await this.clientModel
      .findById(id)
      .populate<{ city: ICity }>({
        path: "city",
        select: "name state"
      })
      .select("fullName gender age birthdate city");
  }

  async find({ fullName }: IFindClientsDTO): Promise<IClientWithCity[]> {
    const query: FilterQuery<IClient> = {};
    if (fullName) {
      query.fullName = {
        $regex: fullName,
        $options: "i",
      };
    }
    return await this.clientModel
      .find(query)
      .populate<{ city: ICity }>({
        path: "city",
        select: "name state"
      })
      .select("fullName gender age birthdate city");
  }

  async create({ fullName, age, birthdate, city_id, gender, }: ICreateClientDTO): Promise<void> {
    await this.clientModel.create({
      fullName,
      age,
      birthdate,
      gender,
      city: city_id,
    });
  }

  async countByFullName(fullName: string): Promise<number> {
    return await this.clientModel.countDocuments({
      fullName: {
        $regex: fullName,
        $options: 'i',
      }
    });
  }

  validateId(id: string): boolean {
    return isValidObjectId(id);
  }

}