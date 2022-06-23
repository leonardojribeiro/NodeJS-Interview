import { InMemoryCitiesRepository } from "../../repositories/in-memory/InMemoryCitiesRepository";
import { ICreateCityDTO } from "../createCity/CreateCityDTO";
import { CreateCityUseCase } from "../createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../findCities/FindCitiesUseCase";
import { FindCityByIdUseCase } from "./FindCityByIdUseCase";
import { FindCityByIdError } from "./FindCityByIdError";
import { Types } from "mongoose";

let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;
let findCityByIdUseCase: FindCityByIdUseCase;
let inMemoryCitiesRepository: InMemoryCitiesRepository;

describe("Find City By Id", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCityByIdUseCase = new FindCityByIdUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
  });

  it("Should be able to find a city by id", async () => {
    const cities = await findCitiesUseCase.execute({});
    const city = cities[0];
    const foundCity = await findCityByIdUseCase.execute(city.id);
    expect(foundCity.id).toBeDefined();
    expect(foundCity.name).toBe("Faina");
    expect(foundCity.state).toBe("Goiás");
  });

  it("Should not be able to find a city that not exists", async () => {
    expect(async () => {
      await findCityByIdUseCase.execute(new Types.ObjectId().toString());
    }).rejects.toBeInstanceOf(FindCityByIdError.NotFound);
  });

  it("Should not be able to find a city with a invalid id", async () => {
    expect(async () => {
      await findCityByIdUseCase.execute("aesdfr25");
    }).rejects.toBeInstanceOf(FindCityByIdError.InvalidId);
  });
}); 