import { InMemoryCitiesRepository } from "../../repositories/in-memory/InMemoryCitiesRepository";
import { FindCitiesUseCase } from "../findCities/FindCitiesUseCase";
import { ICreateCityDTO } from "./CreateCityDTO";
import { CreateCityError } from "./CreateCityError";
import { CreateCityUseCase } from "./CreateCityUseCase";

let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;
let inMemoryCitiesRepository: InMemoryCitiesRepository;

describe("Create City", () => {
  beforeEach(() => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);
  });

  it("Should be able to create a new city", async () => {
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    const cities = await findCitiesUseCase.execute({});
    const cityCreated = cities[0];
    expect(cityCreated.id).toBeDefined();
    expect(cityCreated.name).toBe("Faina");
    expect(cityCreated.state).toBe("Goiás");
  });

  it("Should not be able to create a city without a name", async () => {
    const city: ICreateCityDTO = {
      name: "",
      state: "Goiás",
    };
    expect(async () => {
      await createCityUseCase.execute(city);
    }).rejects.toBeInstanceOf(CreateCityError.EmptyName);
  });

  it("Should not be able to create a city without a state", async () => {
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "",
    };
    expect(async () => {
      await createCityUseCase.execute(city);
    }).rejects.toBeInstanceOf(CreateCityError.EmptyState);
  });

  it("Should not be able to create a duplicated city", async () => {
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    expect(async () => {
      await createCityUseCase.execute(city);
    }).rejects.toBeInstanceOf(CreateCityError.CityAlreadyExists);
  });
}); 